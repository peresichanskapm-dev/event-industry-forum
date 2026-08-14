export type StatCard = {
	value: string;
	label: string;
	description: string;
	background: string;
};

export const STATS_CARDS: StatCard[] = [
	{
		value: '150+',
		label: 'експо-стендів',
		description: 'Найбільше в Україні Event Expo з презентацією готових рішень, інновацій та підрядників.',
		background: '/img/stats/card-2.png',
	},
	{
		value: '6',
		label: 'тематичних сцен та треків',
		description: 'Десятки годин ексклюзивного контенту: від стратегічного MAIN STAGE до Eventology Room.',
		background: '/img/stats/card-3.png',
	},
];
