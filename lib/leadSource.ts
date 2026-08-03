const STORAGE_KEY = 'eif27:lead-source';
const EVENT_NAME = 'eif27:lead-source-updated';

export type LeadSource = {
	formSource: string;
	ticketTitle?: string;
};

export function setLeadSource(source: LeadSource): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(source));
	} catch {
		// Ignore storage failures (private mode, disabled storage).
	}

	window.dispatchEvent(new CustomEvent<LeadSource>(EVENT_NAME, { detail: source }));
}

export function getLeadSource(): LeadSource {
	if (typeof window === 'undefined') {
		return { formSource: '' };
	}

	try {
		const raw = window.sessionStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as LeadSource) : { formSource: '' };
	} catch {
		return { formSource: '' };
	}
}

export function subscribeToLeadSource(callback: (source: LeadSource) => void): () => void {
	const handler = (event: Event) => {
		callback((event as CustomEvent<LeadSource>).detail);
	};

	window.addEventListener(EVENT_NAME, handler);
	return () => window.removeEventListener(EVENT_NAME, handler);
}
