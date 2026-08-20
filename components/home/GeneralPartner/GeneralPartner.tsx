import Image from 'next/image';
import { GENERAL_PARTNER } from './GeneralPartner.data';
import s from './GeneralPartner.module.scss';

export default function GeneralPartner() {
	return (
		<section className={s.generalPartner} id="general-partner">
			<div className="container">
				<h2 className={s.heading} data-reveal>
					{GENERAL_PARTNER.heading}
				</h2>

				<div className={s.row} data-reveal data-reveal-delay="0.1">
					<div className={s.logoWrap}>
						<Image
							src={GENERAL_PARTNER.logo.src}
							alt={GENERAL_PARTNER.logo.alt}
							width={GENERAL_PARTNER.logo.width}
							height={GENERAL_PARTNER.logo.height}
							className={s.logo}
						/>
					</div>
					<div className={s.divider} aria-hidden="true" />
					<p className={s.description}>
						<span className={s.gradientText}>{GENERAL_PARTNER.descriptionGradient}</span>
						{GENERAL_PARTNER.descriptionRest}
					</p>
				</div>
			</div>
		</section>
	);
}
