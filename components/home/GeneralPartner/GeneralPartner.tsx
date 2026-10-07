import type { CSSProperties } from 'react';
import Image from 'next/image';
import { PARTNER_BLOCKS } from './GeneralPartner.data';
import s from './GeneralPartner.module.scss';

const SEGMENT_CLASS = {
	name: `${s.gradientText} ${s.name}`,
	nameGreen: `${s.gradientText} ${s.name} ${s.nameGreen}`,
	accent: s.gradientText,
	tagline: `${s.gradientText} ${s.tagline}`,
};

export default function GeneralPartner() {
	return (
		<>
			{PARTNER_BLOCKS.map((block) => (
				<section key={block.id} className={s.generalPartner} id={block.id}>
					<div className="container">
						<h2 className={s.heading} data-reveal>
							{block.heading}
						</h2>

						<div className={s.row} data-reveal data-reveal-delay="0.1">
							<div
								className={s.logoWrap}
								style={{ '--logo-desktop-width': block.logo.desktopWidth } as CSSProperties}
							>
								<Image
									src={block.logo.src}
									alt={block.logo.alt}
									width={block.logo.width}
									height={block.logo.height}
									className={s.logo}
								/>
							</div>
							<div className={s.divider} aria-hidden="true" />
							<div className={s.description}>
								{block.paragraphs.map((paragraph, i) => (
									<p key={i}>
										{paragraph.map((segment, j) =>
											segment.href ? (
												<a
													key={j}
													href={segment.href}
													target="_blank"
													rel="noopener noreferrer"
													className={s.link}
												>
													{segment.text}
												</a>
											) : segment.style ? (
												<span key={j} className={SEGMENT_CLASS[segment.style]}>
													{segment.text}
												</span>
											) : (
												segment.text
											),
										)}
									</p>
								))}
							</div>
						</div>
					</div>
				</section>
			))}
		</>
	);
}
