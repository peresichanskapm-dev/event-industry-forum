export const ABOUT_INTRO = {
	lead: 'Event Industry Forum 2027 переїжджає до Києва, щоб створити безпрецедентну синергію тих, хто формує майбутнє.',
	quote: 'THE NEXT EXPERIENCE — це глобальна дискусія про те, як українська подієва галузь переходить від адаптації до світового лідерства.',
};

export type AboutTopic = {
	icon: string;
	title: string;
	description: string;
};

export const ABOUT_TOPICS: AboutTopic[] = [
	{
		icon: '/img/icons/topic-technologies.svg',
		title: 'Технології',
		description: 'Інтеграція штучного інтелекту в процеси.',
	},
	{
		icon: '/img/icons/topic-professions.svg',
		title: 'Професії',
		description: 'Трансформація ролей та навичок в івент-командах.',
	},
	{
		icon: '/img/icons/topic-formats.svg',
		title: 'Формати',
		description: 'Еволюція подій різного масштабу.',
	},
	{
		icon: '/img/icons/topic-leadership.svg',
		title: 'Лідерство',
		description: 'Як українському ринку стати глобальним трендсеттером.',
	},
];
