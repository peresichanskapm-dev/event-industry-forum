import Image from 'next/image';
import DevEditablePhoto from '@/components/ui/DevEditablePhoto/DevEditablePhoto';
import { LOCATION_CONTENT } from './Location.data';
import s from './Location.module.scss';

export default function Location() {
	return (
		<section className={s.location}>
			<div className="container">
				<h2 className={s.heading} data-reveal>
					Локація
				</h2>

				<div className={s.layout}>
					<div className={`${s.collage} ${s.collageTop}`}>
						{LOCATION_CONTENT.photos.slice(0, 2).map((photo, index) => (
							<DevEditablePhoto
								key={photo}
								className={`${s.photo} ${s[`photo${index}`]}`}
								storageKey={`location-photo-${index}`}
								data-reveal
								data-reveal-delay={index * 0.1}
							>
								<Image src={photo} alt="" fill sizes="(max-width: 992px) 45vw, 30vw" />
							</DevEditablePhoto>
						))}
					</div>

					<div className={s.card} data-reveal data-reveal-delay="0.1">
						<h3 className={s.title}>{LOCATION_CONTENT.title}</h3>
						{LOCATION_CONTENT.paragraphs.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>

					<div className={`${s.collage} ${s.collageBottom}`}>
						{LOCATION_CONTENT.photos.slice(2, 4).map((photo, offset) => {
							const index = offset + 2;
							return (
								<DevEditablePhoto
									key={photo}
									className={`${s.photo} ${s[`photo${index}`]}`}
									storageKey={`location-photo-${index}`}
									data-reveal
									data-reveal-delay={index * 0.1}
								>
									<Image src={photo} alt="" fill sizes="(max-width: 992px) 45vw, 30vw" />
								</DevEditablePhoto>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
