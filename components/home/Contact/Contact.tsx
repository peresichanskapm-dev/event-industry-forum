'use client';

import Image from 'next/image';
import { useEffect, useState, type FormEvent } from 'react';
import { type TrackingParams, getTrackingForForm } from '@/lib/utm';
import { isPhoneComplete } from '@/lib/phoneMask';
import { usePhoneMask } from '@/lib/usePhoneMask';
import { getLeadSource, subscribeToLeadSource } from '@/lib/leadSource';
import { CONTACT_CONTENT } from './Contact.data';
import s from './Contact.module.scss';

type FormValues = {
	name: string;
	email: string;
	phone: string;
	ticketTitle?: string;
	formSource: string;
};

type ContactPayload = FormValues & TrackingParams;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_LETTER_PATTERN = /\p{L}/u;

export default function Contact() {
	const phoneMask = usePhoneMask();
	const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');
	const [leadSource, setLeadSourceState] = useState({ formSource: '', ticketTitle: '' });

	useEffect(() => {
		const initial = getLeadSource();
		setLeadSourceState({ formSource: initial.formSource, ticketTitle: initial.ticketTitle ?? '' });

		return subscribeToLeadSource((source) => {
			setLeadSourceState({ formSource: source.formSource, ticketTitle: source.ticketTitle ?? '' });
		});
	}, []);

	const validate = (data: FormValues): Partial<Record<keyof FormValues, string>> => {
		const nextErrors: Partial<Record<keyof FormValues, string>> = {};
		const name = data.name.trim();
		const email = data.email.trim();
		const phone = data.phone.trim();

		if (!name) {
			nextErrors.name = CONTACT_CONTENT.errors.nameRequired;
		} else if (name.length < 2) {
			nextErrors.name = CONTACT_CONTENT.errors.nameMinLength;
		} else if (!NAME_LETTER_PATTERN.test(name)) {
			nextErrors.name = CONTACT_CONTENT.errors.nameInvalid;
		}

		if (!email) {
			nextErrors.email = CONTACT_CONTENT.errors.emailRequired;
		} else if (!EMAIL_PATTERN.test(email)) {
			nextErrors.email = CONTACT_CONTENT.errors.emailInvalid;
		}

		if (!phone) {
			nextErrors.phone = CONTACT_CONTENT.errors.phoneRequired;
		} else if (!isPhoneComplete(phone)) {
			nextErrors.phone = CONTACT_CONTENT.errors.phoneMinLength;
		}

		return nextErrors;
	};

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitState('idle');
		setErrors({});

		const form = event.currentTarget;
		const formData = new FormData(form);
		const data: ContactPayload = {
			name: String(formData.get('name') ?? ''),
			email: String(formData.get('email') ?? ''),
			phone: phoneMask.value,
			ticketTitle: leadSource.ticketTitle || undefined,
			formSource: leadSource.formSource || 'Форма підписки внизу сторінки',
			...getTrackingForForm(),
		};
		const validationErrors = validate(data);

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error('Request failed');
			}

			form.reset();
			phoneMask.reset();
			setSubmitState('success');
			window.setTimeout(() => {
				window.location.href = 'https://kyiv.ticketsbox.com/event/event-industry-forum-2027.html';
			}, 1200);
		} catch {
			setSubmitState('error');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className={s.contact} id="form">
			<div className="container">
				<div className={s.brand} data-reveal>
					<p className={s.eyebrow}>{CONTACT_CONTENT.eyebrow}</p>
					<Image src="/img/logo.svg" alt="EIF27 — Event Industry Forum" width={288} height={103} className={s.logo} />
				</div>

				<form className={s.form} onSubmit={onSubmit} noValidate data-reveal data-reveal-delay="0.1">
					{leadSource.ticketTitle && <p className={s.ticketNote}>Обраний пакет: {leadSource.ticketTitle}</p>}
					<div className={s.fields}>
						<div className={s.fieldGroup}>
							<input
								name="name"
								type="text"
								className={s.input}
								placeholder={CONTACT_CONTENT.placeholders.name}
								aria-invalid={errors.name ? 'true' : 'false'}
							/>
							{errors.name && <p className={s.error}>{errors.name}</p>}
						</div>
						<div className={s.fieldGroup}>
							<input
								name="email"
								type="email"
								className={s.input}
								placeholder={CONTACT_CONTENT.placeholders.email}
								aria-invalid={errors.email ? 'true' : 'false'}
							/>
							{errors.email && <p className={s.error}>{errors.email}</p>}
						</div>
						<div className={s.fieldGroup}>
							<input
								name="phone"
								type="tel"
								inputMode="numeric"
								autoComplete="tel"
								className={s.input}
								{...phoneMask.bind}
								aria-invalid={errors.phone ? 'true' : 'false'}
							/>
							{errors.phone && <p className={s.error}>{errors.phone}</p>}
						</div>
						<button className={s.submit} type="submit" disabled={isSubmitting}>
							{CONTACT_CONTENT.submit}
						</button>
					</div>
					{submitState !== 'idle' && (
						<p className={submitState === 'success' ? s.success : s.submitError} role="status">
							{submitState === 'success' ? CONTACT_CONTENT.submitSuccess : CONTACT_CONTENT.submitError}
						</p>
					)}
				</form>
			</div>
		</section>
	);
}
