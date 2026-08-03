export type NavItem = {
	anchor: string;
	label: string;
};

export const NAV_ITEMS: NavItem[] = [
	{ anchor: '#about', label: 'Про подію' },
	{ anchor: '#speakers', label: 'Спікери' },
	{ anchor: '#tickets', label: 'Пакети участі' },
	{ anchor: '#pricing-schedule', label: 'Графік цін' },
];
