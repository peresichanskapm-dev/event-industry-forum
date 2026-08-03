let cancelActiveHashScroll: (() => void) | null = null;

function getHashTarget(href: string): HTMLElement | null {
	if (typeof window === 'undefined') {
		return null;
	}

	const hashIndex = href.indexOf('#');
	if (hashIndex < 0) {
		return null;
	}

	const hash = href.slice(hashIndex);
	if (hash.length <= 1) {
		return null;
	}

	if (!href.startsWith('#')) {
		let url: URL;
		try {
			url = new URL(href, window.location.href);
		} catch {
			return null;
		}

		const isSamePage = url.origin === window.location.origin && url.pathname === window.location.pathname && url.search === window.location.search;
		if (!isSamePage) {
			return null;
		}
	}

	try {
		return document.getElementById(decodeURIComponent(hash.slice(1)));
	} catch {
		return document.getElementById(hash.slice(1));
	}
}

function getHeaderOffset(): number {
	const root = document.documentElement;
	const styles = window.getComputedStyle(root);
	const rawOffset = styles.getPropertyValue('--header-offset').trim();
	const offsetValue = Number.parseFloat(rawOffset);

	if (!Number.isFinite(offsetValue)) {
		return 0;
	}

	if (rawOffset.endsWith('rem')) {
		const rootFontSize = Number.parseFloat(styles.fontSize);
		return offsetValue * (Number.isFinite(rootFontSize) ? rootFontSize : 16);
	}

	return offsetValue;
}

function scrollToHashTarget(target: HTMLElement, behavior: ScrollBehavior) {
	const targetTop = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
	window.scrollTo({ top: Math.max(0, Math.round(targetTop)), behavior });
}

function trackHashTargetScroll(target: HTMLElement, initialBehavior: ScrollBehavior) {
	cancelActiveHashScroll?.();

	let isActive = true;
	const timeouts: number[] = [];
	const abortController = new AbortController();
	const root = document.documentElement;
	const cancel = () => {
		isActive = false;
		resizeObserver?.disconnect();
		mutationObserver.disconnect();
		timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
		abortController.abort();
		cancelActiveHashScroll = null;
	};
	const scheduleCorrection = (delay: number, behavior: ScrollBehavior = 'auto') => {
		const timeoutId = window.setTimeout(() => {
			if (!isActive) return;
			scrollToHashTarget(target, behavior);
		}, delay);
		timeouts.push(timeoutId);
	};
	const onLayoutChanged = () => scheduleCorrection(80);
	const mutationObserver = new MutationObserver(onLayoutChanged);
	const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(onLayoutChanged) : null;

	cancelActiveHashScroll = cancel;
	window.addEventListener('wheel', cancel, { passive: true, once: true, signal: abortController.signal });
	window.addEventListener('touchstart', cancel, { passive: true, once: true, signal: abortController.signal });
	window.addEventListener('keydown', cancel, { passive: true, once: true, signal: abortController.signal });
	mutationObserver.observe(document.body, { childList: true, subtree: true });
	resizeObserver?.observe(root);
	resizeObserver?.observe(document.body);
	resizeObserver?.observe(target);

	window.requestAnimationFrame(() => {
		window.requestAnimationFrame(() => scrollToHashTarget(target, initialBehavior));
	});
	[350, 800, 1400, 2200, 3200, 4800].forEach((delay) => scheduleCorrection(delay));
	scheduleCorrection(6200);
	scheduleCorrection(6500, 'auto');
	window.setTimeout(cancel, 6800);
}

export function handleLocalHashClick(href: string): boolean {
	const target = getHashTarget(href);
	if (!target) {
		return false;
	}

	const hash = href.slice(href.indexOf('#'));
	const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

	window.history.pushState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
	trackHashTargetScroll(target, behavior);

	return true;
}
