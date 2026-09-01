import Image from 'next/image';
import { ABOUT_INTRO, ABOUT_TOPICS } from './About.data';
import s from './About.module.scss';

export default function About() {
	return (
		<section className={s.about} id="about">
			<div className="container">
				<div className={s.intro} data-reveal>
					<p className={s.quote}>{ABOUT_INTRO.quote}</p>
				</div>

				<h2 className={s.heading} data-reveal>
					Поговоримо про
				</h2>

				<div className={s.grid}>
					{ABOUT_TOPICS.map((topic, index) => (
						<article className={s.card} key={topic.title} data-reveal data-reveal-delay={Math.min(index * 0.08, 0.3)}>
							<Image src={topic.icon} alt="" width={56} height={56} />
							<h3>{topic.title}</h3>
							<p>{topic.description}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
