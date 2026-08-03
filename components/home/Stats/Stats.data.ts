export type StatCard = {
	value: string;
	label: string;
	description: string;
	background: string;
};

export const STATS_CARDS: StatCard[] = [
	{
		value: '1500+',
		label: 'учасників',
		description: 'Організатори, агенції, корпоративні замовники, локації та артисти з усієї країни.',
		background: '/img/stats/card-1.png',
	},
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
