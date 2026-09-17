import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { isPhoneComplete } from '@/lib/phoneMask';
import { TRACKING_FIELDS, type TrackingField } from '@/lib/utm';

export const runtime = 'nodejs';

type Payload = {
	name?: string;
	email?: string;
	phone?: string;
	ticketTitle?: string;
	formSource?: string;
} & Partial<Record<TrackingField, string>>;

const NAME_LETTER_PATTERN = /\p{L}/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LEAD_EMAIL_TO = 'eif@globalevents.planfix.ua';
const LEAD_EMAIL_SUBJECT = 'Заявка з форми сайту EIF';

const TRACKING_FIELD_LABELS: Partial<Record<TrackingField, string>> = {
	fbclid: 'Click-ID',
};

function escapeHtml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function POST(request: Request) {
	const token = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TELEGRAM_CHAT_ID;

	if (!token || !chatId) {
		return NextResponse.json({ error: 'Telegram credentials are not configured.' }, { status: 500 });
	}

	const payload = (await request.json()) as Payload;
	const name = payload?.name?.trim();
	const email = payload?.email?.trim();
	const phone = payload?.phone?.trim();
	const ticketTitle = payload?.ticketTitle?.trim();
	const formSource = payload?.formSource?.trim() || 'Форма на сайті EIF27';

	if (!name || !phone) {
		return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
	}

	if (name.length < 2 || !NAME_LETTER_PATTERN.test(name)) {
		return NextResponse.json({ error: 'Invalid name.' }, { status: 400 });
	}

	if (!isPhoneComplete(phone)) {
		return NextResponse.json({ error: 'Invalid phone.' }, { status: 400 });
	}

	if (email && !EMAIL_PATTERN.test(email)) {
		return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
	}

	const buildLeadLines = (escape: (value: string) => string): string[] => {
		const trackingLines = TRACKING_FIELDS.map((field) => {
			const value = payload[field]?.trim();
			const label = TRACKING_FIELD_LABELS[field] ?? field;
			return value ? `${label}: ${escape(value)}` : null;
		});

		return [
			`Джерело: ${escape(formSource)}`,
			`Ім'я: ${escape(name)}`,
			email ? `Email: ${escape(email)}` : null,
			`Телефон: ${escape(phone)}`,
			ticketTitle ? `Квиток: ${escape(ticketTitle)}` : null,
			...trackingLines,
		].filter((line): line is string => Boolean(line));
	};

	const telegramText = ['🔔 Нова заявка з сайту EIF27:', '', ...buildLeadLines(escapeHtml)].join('\n');

	const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			chat_id: chatId,
			text: telegramText,
			parse_mode: 'HTML',
		}),
	});

	if (!telegramResponse.ok) {
		return NextResponse.json({ error: 'Telegram request failed.' }, { status: 502 });
	}

	const smtpHost = process.env.SMTP_HOST;
	const smtpPort = process.env.SMTP_PORT;
	const smtpUser = process.env.SMTP_USER;
	const smtpPass = process.env.SMTP_PASS;

	if (smtpHost && smtpPort && smtpUser && smtpPass) {
		const transporter = nodemailer.createTransport({
			host: smtpHost,
			port: Number(smtpPort),
			secure: Number(smtpPort) === 465,
			auth: { user: smtpUser, pass: smtpPass },
		});

		try {
			await transporter.sendMail({
				from: process.env.SMTP_FROM || smtpUser,
				to: LEAD_EMAIL_TO,
				subject: LEAD_EMAIL_SUBJECT,
				text: buildLeadLines((value) => value).join('\n'),
			});
		} catch (error) {
			console.error('Failed to send lead email notification:', error);
		}
	}

	return NextResponse.json({ ok: true });
}
