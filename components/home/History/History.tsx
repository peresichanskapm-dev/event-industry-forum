'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import type { SwiperModule } from 'swiper/types';
import type { SwiperProps, SwiperSlideProps } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';

import { HISTORY_CARDS } from './History.data';
import HistoryCard from './HistoryCard';
import s from './History.module.scss';

export default function History() {
	const sectionRef = useRef<HTMLElement | null>(null);
	const [shouldLoadSwiper, setShouldLoadSwiper] = useState(false);
	const [SwiperComponent, setSwiperComponent] = useState<ComponentType<SwiperProps> | null>(null);
	const [SwiperSlideComponent, setSwiperSlideComponent] = useState<ComponentType<SwiperSlideProps> | null>(null);
	const [swiperModules, setSwiperModules] = useState<SwiperModule[] | null>(null);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (shouldLoadSwiper) return;

		const node = sectionRef.current;
		if (!node || !('IntersectionObserver' in window)) {
			setShouldLoadSwiper(true);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setShouldLoadSwiper(true);
					observer.disconnect();
				}
			},
			{ rootMargin: '300px 0px' }
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [shouldLoadSwiper]);

	useEffect(() => {
		if (!shouldLoadSwiper) return;

		let isMounted = true;
		Promise.all([import('swiper/react'), import('swiper/modules')]).then(([reactModule, modules]) => {
			if (!isMounted) return;
			setSwiperComponent(() => reactModule.Swiper);
			setSwiperSlideComponent(() => reactModule.SwiperSlide);
			setSwiperModules([modules.FreeMode, modules.Scrollbar, modules.Mousewheel, modules.Keyboard]);
		});

		return () => {
			isMounted = false;
		};
	}, [shouldLoadSwiper]);

	return (
		<section ref={sectionRef} className={s.history}>
			<div className="container">
				<h2 className={s.heading} data-reveal>
					Історія EIF у цифрах
				</h2>

				{SwiperComponent && SwiperSlideComponent && swiperModules ? (
					<>
						<div className={s.scrollbar}>
							<div className={s.scrollbarFill} style={{ width: `${progress * 100}%` }} />
						</div>
						<SwiperComponent
							modules={swiperModules}
							slidesPerView="auto"
							spaceBetween={24}
							freeMode={{ enabled: true, momentum: true, momentumRatio: 0.9 }}
							mousewheel={{ forceToAxis: true, sensitivity: 1 }}
							keyboard={{ enabled: true, onlyInViewport: true }}
							scrollbar={{ el: `.${s.scrollbar}`, draggable: true }}
							onProgress={(_swiper, ratio) => setProgress(ratio)}
							className={s.swiper}
						>
							{HISTORY_CARDS.map((card) => (
								<SwiperSlideComponent key={card.year} className={`${s.slide} ${card.current ? s.slideCurrent : ''}`}>
									<HistoryCard card={card} />
								</SwiperSlideComponent>
							))}
						</SwiperComponent>
					</>
				) : (
					<>
						<div className={s.scrollbar} aria-hidden />
						<div className={`${s.swiper} ${s.fallbackScroller}`} role="list" aria-label="Історія EIF у цифрах">
							{HISTORY_CARDS.map((card) => (
								<div key={card.year} className={`${s.slide} ${card.current ? s.slideCurrent : ''}`} role="listitem">
									<HistoryCard card={card} />
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</section>
	);
}
