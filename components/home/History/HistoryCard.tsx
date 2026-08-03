import Image from 'next/image';
import type { HistoryCard as HistoryCardData } from './History.data';
import s from './History.module.scss';

type Props = {
	card: HistoryCardData;
};

export default function HistoryCard({ card }: Props) {
	return (
		<article className={`${s.card} ${card.current ? s.cardCurrent : ''}`}>
			<div className={s.photo}>
				<Image src={card.photo} alt={card.year} fill sizes="(max-width: 768px) 80vw, 30vw" />
			</div>
			<p className={`${s.year} ${card.current || card.highlight ? s.yearGradient : ''}`}>{card.year}</p>
			<p className={s.description}>{card.description}</p>
			<div className={s.stats}>
				{card.stats.map((stat) => (
					<div key={stat.label} className={s.stat}>
						<p className={s.statValue}>{stat.value}</p>
						<p className={s.statLabel}>{stat.label}</p>
					</div>
				))}
			</div>
		</article>
	);
}
