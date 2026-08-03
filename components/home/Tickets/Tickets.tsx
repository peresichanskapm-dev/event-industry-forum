'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import type { SwiperModule } from 'swiper/types';
import type { SwiperProps, SwiperSlideProps } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';

import { getTicketCardPriceMap } from '@/lib/pricingSchedule';
import { TICKET_PACKAGES } from './Tickets.data';
import TicketCard from './TicketCard';
import s from './Tickets.module.scss';

export default function Tickets() {
	const sectionRef = useRef<HTMLElement | null>(null);
	const [shouldLoadSwiper, setShouldLoadSwiper] = useState(false);
	const [SwiperComponent, setSwiperComponent] = useState<ComponentType<SwiperProps> | null>(null);
	const [SwiperSlideComponent, setSwiperSlideComponent] = useState<ComponentType<SwiperSlideProps> | null>(null);
	const [swiperModules, setSwiperModules] = useState<SwiperModule[] | null>(null);
	const priceMap = getTicketCardPriceMap();

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
		<section ref={sectionRef} className={s.tickets} id="tickets">
			<div className="container">
				<h2 className={s.heading} data-reveal>
					Квитки
				</h2>

				{SwiperComponent && SwiperSlideComponent && swiperModules ? (
					<>
						<SwiperComponent
							modules={swiperModules}
							slidesPerView="auto"
							spaceBetween={24}
							freeMode={{ enabled: true, momentum: true, momentumRatio: 0.9 }}
							mousewheel={{ forceToAxis: true, sensitivity: 1 }}
							keyboard={{ enabled: true, onlyInViewport: true }}
							scrollbar={{ el: `.${s.scrollbar}`, draggable: true }}
							className={s.swiper}
						>
							{TICKET_PACKAGES.map((pack) => (
								<SwiperSlideComponent key={pack.tierId} className={s.slide}>
									<TicketCard pack={pack} price={priceMap[pack.tierId].price} />
								</SwiperSlideComponent>
							))}
						</SwiperComponent>
						<div className={s.scrollbar} />
					</>
				) : (
					<>
						<div className={`${s.swiper} ${s.fallbackScroller}`} role="list" aria-label="Квитки">
							{TICKET_PACKAGES.map((pack) => (
								<div key={pack.tierId} className={s.slide} role="listitem">
									<TicketCard pack={pack} price={priceMap[pack.tierId].price} />
								</div>
							))}
						</div>
						<div className={s.scrollbar} aria-hidden />
					</>
				)}
			</div>
		</section>
	);
}
