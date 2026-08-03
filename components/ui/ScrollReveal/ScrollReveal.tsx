'use client';

import { useEffect } from 'react';

type RevealElement = HTMLElement & {
	dataset: {
		revealDelay?: string;
		revealDuration?: string;
		revealDistance?: string;
	};
};

function getDataNumber(value: string | undefined, fallback: number): number {
	if (!value) return fallback;
	const parsedValue = Number(value);
	return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

export default function ScrollReveal() {
	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			return;
		}

		const revealElements = Array.from(document.querySelectorAll<RevealElement>('[data-reveal]'));
		const targetOpacity = new WeakMap<Element, string>();
		const revealCleanupTimeouts: number[] = [];
		const revealObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					const element = entry.target as RevealElement;
					const delay = getDataNumber(element.dataset.revealDelay, 0);
					const duration = getDataNumber(element.dataset.revealDuration, 0.85);
					const cleanupDelay = (delay + duration) * 1000 + 50;

					element.style.transform = 'translate3d(0, 0, 0)';
					element.style.opacity = targetOpacity.get(element) ?? '1';
					element.style.willChange = 'auto';
					const cleanupTimeoutId = window.setTimeout(() => {
						element.style.transitionProperty = '';
						element.style.transitionDuration = '';
						element.style.transitionTimingFunction = '';
						element.style.transitionDelay = '';
					}, cleanupDelay);
					revealCleanupTimeouts.push(cleanupTimeoutId);
					observer.unobserve(element);
				});
			},
			{
				root: null,
				rootMargin: '0px 0px -1% 0px',
				threshold: 0.01,
			}
		);

		revealElements.forEach((element) => {
			const delay = getDataNumber(element.dataset.revealDelay, 0);
			const duration = getDataNumber(element.dataset.revealDuration, 0.85);
			const distance = getDataNumber(element.dataset.revealDistance, 40);

			targetOpacity.set(element, window.getComputedStyle(element).opacity);
			element.style.opacity = '0';
			element.style.transform = `translate3d(0, ${distance}px, 0)`;
			element.style.transitionProperty = 'opacity, transform';
			element.style.transitionDuration = `${duration}s`;
			element.style.transitionTimingFunction = 'cubic-bezier(0.22, 1, 0.36, 1)';
			element.style.transitionDelay = `${delay}s`;
			element.style.willChange = 'opacity, transform';

			revealObserver.observe(element);
		});

		return () => {
			revealObserver.disconnect();
			revealCleanupTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
		};
	}, []);

	return null;
}
