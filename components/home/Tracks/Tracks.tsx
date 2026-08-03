import Image from 'next/image';
import { TRACKS } from './Tracks.data';
import s from './Tracks.module.scss';

export default function Tracks() {
	return (
		<section className={s.tracks}>
			<div className="container">
				<h2 className={s.heading} data-reveal>
					EIF Kyiv 2027 - <span className={s.gradientText}>як це буде?</span>
				</h2>
				<p className={s.subheading} data-reveal>
					8 треків — 8 напрямків для розвитку, партнерств і нових можливостей
				</p>

				<div className={s.grid}>
					{TRACKS.map((track, index) => (
						<article className={s.card} key={track.title} data-reveal data-reveal-delay={Math.min(index * 0.05, 0.4)}>
							<div className={s.photo}>
								<Image src={track.photo} alt="" fill sizes="(max-width: 768px) 90vw, 25vw" />
							</div>
							<div className={s.icon}>
								<Image src={track.icon} alt="" width={28} height={28} />
							</div>
							<h3 className={s.title}>{track.title}</h3>
							{track.kicker && (
								<div className={s.kickerRow}>
									<span className={s.kicker}>{track.kicker}</span>
									<span className={s.kickerLine} />
								</div>
							)}
							<p className={s.description}>{track.description}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
