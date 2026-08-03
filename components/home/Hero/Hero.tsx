'use client';

import Button from '@/components/ui/Button/Button';
import DevEditablePhoto from '@/components/ui/DevEditablePhoto/DevEditablePhoto';
import { setLeadSource } from '@/lib/leadSource';
import { HERO_CONTENT } from './Hero.data';
import s from './Hero.module.scss';

export default function Hero() {
	return (
		<section className={s.hero} id="hero">
			<div className={`container ${s.wrap}`}>
				<div className={s.visual} data-reveal data-reveal-duration="1.1">
					<DevEditablePhoto className={s.videoBox} storageKey="hero-video-mobile-rect">
						<video className={s.video} src="/videos/hero.mp4" autoPlay loop muted playsInline />
					</DevEditablePhoto>
					<div className={s.fadeRight} aria-hidden="true" />
					<div className={s.fadeTop} aria-hidden="true" />
					<div className={s.fadeBottom} aria-hidden="true" />
				</div>

				<div className={s.content}>
					<div className={s.meta} data-reveal>
						<span className={s.date}>{HERO_CONTENT.date}</span>
						<span className={s.location}>{HERO_CONTENT.location}</span>
					</div>

					<h1 className={s.title} data-reveal data-reveal-delay="0.1">
						{HERO_CONTENT.titleLine1}
						<br />
						<span className={s.gradientText}>{HERO_CONTENT.titleLine2}</span>
					</h1>

					<p className={s.tagline} data-reveal data-reveal-delay="0.15">
						{HERO_CONTENT.tagline}
					</p>

					<p className={s.description} data-reveal data-reveal-delay="0.2">
						{HERO_CONTENT.description}
					</p>

					<div className={s.actions} data-reveal data-reveal-delay="0.25">
						<Button href="#form" onClick={() => setLeadSource({ formSource: 'Hero — Купити квиток' })}>
							{HERO_CONTENT.ticketButton}
						</Button>
						<Button href="#form" variant="secondary" onClick={() => setLeadSource({ formSource: 'Hero — Стати партнером' })}>
							{HERO_CONTENT.partnerButton}
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
