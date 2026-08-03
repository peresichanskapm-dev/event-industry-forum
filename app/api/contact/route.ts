import { NextResponse } from 'next/server';
import { TRACKING_FIELDS, type TrackingField } from '@/lib/utm';

export const runtime = 'nodejs';

type Payload = {
	name?: string;
	email?: string;
	phone?: string;
	ticketTitle?: string;
	formSource?: string;
} & Partial<Record<TrackingField, string>>;

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

	const trackingLines = TRACKING_FIELDS.map((field) => {
		const value = payload[field]?.trim();
		return value ? `${field}: ${value}` : null;
	}).filter(Boolean);

	const textLines = [
		'🔔 Нова заявка з сайту EIF27:',
		'',
		`Джерело: ${formSource}`,
		`Ім'я: ${name}`,
		email ? `Email: ${email}` : null,
		`Телефон: ${phone}`,
		ticketTitle ? `Квиток: ${ticketTitle}` : null,
		...trackingLines,
	];
	const text = textLines.filter((line): line is string => Boolean(line)).join('\n');

	const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			chat_id: chatId,
			text,
			parse_mode: 'HTML',
		}),
	});

	if (!telegramResponse.ok) {
		return NextResponse.json({ error: 'Telegram request failed.' }, { status: 502 });
	}

	return NextResponse.json({ ok: true });
}
