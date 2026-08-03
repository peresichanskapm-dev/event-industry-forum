export type TrackCard = {
	icon: string;
	photo: string;
	kicker?: string;
	title: string;
	description: string;
};

export const TRACKS: TrackCard[] = [
	{
		icon: '/img/icons/track-main-stage.svg',
		photo: '/img/tracks/main-stage.webp',
		kicker: 'Stage',
		title: 'Main',
		description: 'стратегічні тренди, глобальні виклики та візіонерські виступи.',
	},
	{
		icon: '/img/icons/track-technical.svg',
		photo: '/img/tracks/technical.webp',
		kicker: 'Track',
		title: 'Technical',
		description: 'усе про технічне забезпечення подій.',
	},
	{
		icon: '/img/icons/track-wedding.svg',
		photo: '/img/tracks/wedding.webp',
		kicker: 'Track',
		title: 'Wedding',
		description: 'інновації та нові стандарти весільної індустрії.',
	},
	{
		icon: '/img/icons/track-show-business.svg',
		photo: '/img/tracks/show-business.webp',
		kicker: 'Track',
		title: 'Show Business',
		description: 'колаборації з артистами, менеджмент та шоу-програми.',
	},
	{
		icon: '/img/icons/track-vendors-venues.svg',
		photo: '/img/tracks/vendors-venues.webp',
		kicker: 'Track',
		title: 'Vendors & Venues',
		description: 'ефективна взаємодія з локаціями та постачальниками.',
	},
	{
		icon: '/img/icons/track-eventology.svg',
		photo: '/img/tracks/eventology.webp',
		kicker: 'Room',
		title: 'Eventology',
		description: 'практична лабораторія створення сенсів та івент-маркетингу.',
	},
	{
		icon: '/img/icons/track-networking.svg',
		photo: '/img/tracks/networking.webp',
		kicker: 'Room',
		title: 'Networking',
		description: 'AI-платформа для знайомств, що допоможе знайти партнерів та клієнтів ще до початку форуму.',
	},
	{
		icon: '/img/icons/track-afterparty.svg',
		photo: '/img/tracks/afterparty.webp',
		title: 'Afterparty',
		description: 'Завершенням насиченого бізнес-дня стане незабутнє afterparty та серія неформальних зустрічей поза межами форуму для закріплення нових знайомств у невимушеній атмосфері.',
	},
];
