import Image from 'next/image';
import { STATS_CARDS } from './Stats.data';
import s from './Stats.module.scss';

export default function Stats() {
	return (
		<section className={s.stats}>
			<div className="container">
				<h2 className={s.heading} data-reveal>
					Event Industry Forum – це
				</h2>

				<div className={s.grid}>
					{STATS_CARDS.map((card, index) => (
						<article className={s.card} key={card.value} data-reveal data-reveal-delay={Math.min(index * 0.1, 0.3)}>
							<Image src={card.background} alt="" fill className={s.background} sizes="(max-width: 992px) 100vw, 33vw" />
							<p className={s.value}>{card.value}</p>
							{card.label && <p className={s.label}>{card.label}</p>}
							<p className={s.description}>{card.description}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
