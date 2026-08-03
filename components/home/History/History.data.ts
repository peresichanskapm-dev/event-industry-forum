export type HistoryStat = {
	value: string;
	label: string;
};

export type HistoryCard = {
	year: string;
	photo: string;
	description: string;
	stats: HistoryStat[];
	current?: boolean;
	highlight?: boolean;
};

export const HISTORY_CARDS: HistoryCard[] = [
	{
		year: '2018',
		photo: '/img/history/2018.png',
		description: 'Ідея створити майданчик для комунікації івенторів призвела до створення першої події у лютому 2018-го року.',
		stats: [
			{ value: '800', label: 'учасників' },
			{ value: '50', label: 'спікерів' },
			{ value: '5', label: 'країн учасниць' },
			{ value: '3', label: 'тематичні зали' },
		],
		highlight: true,
	},
	{
		year: '2019',
		photo: '/img/history/2019.png',
		description: 'Успішне проведення першого заходу призвело до популярності форуму на національному рівні та іміджу головного івент-нетворкінгу країни.',
		stats: [
			{ value: '1200', label: 'учасників' },
			{ value: '50', label: 'спікерів' },
			{ value: '8', label: 'країн учасниць' },
			{ value: '5', label: 'тематичних залів' },
		],
		highlight: true,
	},
	{
		year: '2020',
		photo: '/img/history/2020.png',
		description: 'Третій форум, найбільш успішний по відвідуваності, подіях та контенту.',
		stats: [
			{ value: '1400', label: 'учасників' },
			{ value: '100', label: 'спікерів' },
			{ value: '12', label: 'країн учасниць' },
			{ value: '7', label: 'тематичних залів' },
		],
	},
	{
		year: '2021',
		photo: '/img/history/2021.png',
		description: 'В умовах панденоміки попри локдаун подія відбулась та підкреслила значимість як онлайн, так і офлайн форматів.',
		stats: [
			{ value: '441', label: 'учасник' },
			{ value: '20', label: 'спікерів' },
			{ value: '4', label: 'країни учасниці' },
			{ value: '1', label: 'зал' },
		],
	},
	{
		year: '2026',
		photo: '/img/history/2026.png',
		description: 'Івент став головним днем трансформації індустрії, після 5 річної паузи.',
		stats: [
			{ value: '863', label: 'учасники' },
			{ value: '40', label: 'спікерів' },
			{ value: '1', label: 'країна учасниця' },
			{ value: '1', label: 'зал' },
		],
		current: true,
	},
];
