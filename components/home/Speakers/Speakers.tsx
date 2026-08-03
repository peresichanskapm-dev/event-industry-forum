import Image from 'next/image';
import { SPEAKERS } from './Speakers.data';
import s from './Speakers.module.scss';

export default function Speakers() {
	return (
		<section className={s.speakers} id="speakers">
			<div className="container">
				<h2 className={s.heading} data-reveal>
					Спікери події
				</h2>

				<div className={s.grid}>
					{SPEAKERS.map((speaker, index) => (
						<article className={s.card} key={speaker.name} data-reveal data-reveal-delay={Math.min(index * 0.06, 0.3)}>
							<div className={s.photo}>
								<Image src={speaker.photo} alt={speaker.name} fill sizes="(max-width: 768px) 45vw, 22vw" />
							</div>
							<h3 className={s.name}>{speaker.name}</h3>
							<div className={s.nameLine} />
							<p className={s.bio}>{speaker.bio}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
