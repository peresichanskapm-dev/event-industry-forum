export const TRACKING_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

export type TrackingField = (typeof TRACKING_FIELDS)[number];

export type TrackingParams = {
	[K in TrackingField]: string;
};

const EMPTY_TRACKING: TrackingParams = {
	utm_source: '',
	utm_medium: '',
	utm_campaign: '',
	utm_term: '',
	utm_content: '',
};

export function getTrackingForForm(): TrackingParams {
	if (typeof window === 'undefined') {
		return EMPTY_TRACKING;
	}

	const params = new URLSearchParams(window.location.search);

	return TRACKING_FIELDS.reduce<TrackingParams>(
		(acc, field) => {
			acc[field] = params.get(field) ?? '';
			return acc;
		},
		{ ...EMPTY_TRACKING }
	);
}
