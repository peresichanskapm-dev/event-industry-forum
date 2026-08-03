'use client';

import Image from 'next/image';
import Button from '@/components/ui/Button/Button';
import { setLeadSource } from '@/lib/leadSource';
import { EXPO_CONTENT } from './Expo.data';
import s from './Expo.module.scss';

export default function Expo() {
	return (
		<section className={s.expo}>
			<div className="container">
				<h2 className={s.heading} data-reveal>
					Event Expo 2027
				</h2>

				<div className={s.layout}>
					<div className={s.photo} data-reveal>
						<Image src={EXPO_CONTENT.photo} alt="" fill sizes="(max-width: 992px) 100vw, 45vw" />
					</div>

					<div className={s.content} data-reveal data-reveal-delay="0.1">
						<p className={s.description}>
							<span className={s.highlighted}>{EXPO_CONTENT.highlightedText}</span> {EXPO_CONTENT.description}
						</p>

						<ul className={s.bullets}>
							{EXPO_CONTENT.bullets.map((bullet) => (
								<li key={bullet}>{bullet}</li>
							))}
						</ul>

						<Button href="#form" onClick={() => setLeadSource({ formSource: 'Event Expo — Взяти участь у виставці' })}>
							{EXPO_CONTENT.cta}
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
