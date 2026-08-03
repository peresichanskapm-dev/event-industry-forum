export const PRICING_TIME_ZONE = 'Europe/Kyiv';

const HRYVNIA_SYMBOL = '₴';

export type TicketTierId = 'expo-visitor' | 'expo-visitor-plus' | 'participant' | 'all-access' | 'online';

type PricingPhase = {
	id: string;
	phase: string;
	startDate: string;
	endDate: string;
	prices: Record<TicketTierId, number>;
};

export const PRICING_COLUMNS: ReadonlyArray<{
	tierId: TicketTierId;
	label: string;
}> = [
	{ tierId: 'expo-visitor', label: 'Expo Visitor' },
	{ tierId: 'expo-visitor-plus', label: 'Expo Visitor +' },
	{ tierId: 'participant', label: 'Participant' },
	{ tierId: 'all-access', label: 'All Access' },
	{ tierId: 'online', label: 'Online' },
];

export const TICKET_CARD_ORDER: ReadonlyArray<TicketTierId> = ['expo-visitor', 'expo-visitor-plus', 'participant', 'all-access', 'online'];

const PRICING_PHASES: ReadonlyArray<PricingPhase> = [
	{
		id: 'presale-50',
		phase: 'Presale 50',
		startDate: '2026-08-01',
		endDate: '2026-08-15',
		prices: { 'expo-visitor': 990, 'expo-visitor-plus': 1190, participant: 2990, 'all-access': 4990, online: 890 },
	},
	{
		id: 'early-birds',
		phase: 'Early Birds',
		startDate: '2026-08-16',
		endDate: '2026-09-15',
		prices: { 'expo-visitor': 1190, 'expo-visitor-plus': 1390, participant: 3390, 'all-access': 5590, online: 990 },
	},
	{
		id: 'first-price',
		phase: 'First Price',
		startDate: '2026-09-16',
		endDate: '2026-10-31',
		prices: { 'expo-visitor': 1390, 'expo-visitor-plus': 1590, participant: 3790, 'all-access': 6490, online: 1190 },
	},
	{
		id: 'main-price',
		phase: 'Main Price',
		startDate: '2026-11-01',
		endDate: '2027-01-17',
		prices: { 'expo-visitor': 1590, 'expo-visitor-plus': 1790, participant: 4190, 'all-access': 7290, online: 1290 },
	},
	{
		id: 'lazy-owls',
		phase: 'Lazy Owls',
		startDate: '2027-01-18',
		endDate: '2027-02-14',
		prices: { 'expo-visitor': 1790, 'expo-visitor-plus': 1990, participant: 4390, 'all-access': 7690, online: 1390 },
	},
	{
		id: 'last-chance',
		phase: 'Last Chance',
		startDate: '2027-02-15',
		endDate: '2027-02-24',
		prices: { 'expo-visitor': 1990, 'expo-visitor-plus': 1990, participant: 4390, 'all-access': 7690, online: 1390 },
	},
	{
		id: 'event-price',
		phase: 'Event Price',
		startDate: '2027-02-25',
		endDate: '2027-02-25',
		prices: { 'expo-visitor': 2190, 'expo-visitor-plus': 2490, participant: 5190, 'all-access': 8590, online: 1590 },
	},
];

export type PricingRow = {
	date: string;
	phase: string;
	values: string[];
	highlight: boolean;
	blur: boolean;
	isActive: boolean;
};

type TicketCardPrice = {
	price: string;
};

function padDatePart(value: string): string {
	return value.padStart(2, '0');
}

function formatNumber(value: number): string {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function formatShortDate(dateKey: string): string {
	const [year, month, day] = dateKey.split('-');
	return `${day}.${month}.${year.slice(-2)}`;
}

function normalizeDateKey(dateOrKey: Date | string = new Date()): string {
	if (typeof dateOrKey === 'string') {
		return dateOrKey;
	}

	return getPricingDateKey(dateOrKey);
}

function formatTicketPrice(value: number): string {
	return `${formatNumber(value)}${HRYVNIA_SYMBOL}`;
}

export function getPricingDateKey(date: Date = new Date()): string {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: PRICING_TIME_ZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).formatToParts(date);

	const year = parts.find((part) => part.type === 'year')?.value;
	const month = parts.find((part) => part.type === 'month')?.value;
	const day = parts.find((part) => part.type === 'day')?.value;

	if (!year || !month || !day) {
		throw new Error('Failed to resolve pricing date key.');
	}

	return `${year}-${padDatePart(month)}-${padDatePart(day)}`;
}

export function getActivePricingPhaseIndex(dateOrKey?: Date | string): number {
	const dateKey = normalizeDateKey(dateOrKey);
	const activePhaseIndex = PRICING_PHASES.findIndex(({ startDate, endDate }) => startDate <= dateKey && dateKey <= endDate);

	if (activePhaseIndex >= 0) {
		return activePhaseIndex;
	}

	if (dateKey < PRICING_PHASES[0].startDate) {
		return 0;
	}

	return PRICING_PHASES.length - 1;
}

export function getPricingRows(dateOrKey?: Date | string): PricingRow[] {
	const activePhaseIndex = getActivePricingPhaseIndex(dateOrKey);

	return PRICING_PHASES.map((phase, index) => ({
		phase: phase.phase,
		date: phase.startDate === phase.endDate ? formatShortDate(phase.startDate) : `${formatShortDate(phase.startDate)} - ${formatShortDate(phase.endDate)}`,
		values: PRICING_COLUMNS.map(({ tierId }) => formatNumber(phase.prices[tierId])),
		highlight: index === activePhaseIndex,
		blur: index < activePhaseIndex,
		isActive: index === activePhaseIndex,
	}));
}

export function getTicketCardPriceMap(dateOrKey?: Date | string): Record<TicketTierId, TicketCardPrice> {
	const activePhaseIndex = getActivePricingPhaseIndex(dateOrKey);
	const activePhase = PRICING_PHASES[activePhaseIndex];

	return PRICING_COLUMNS.reduce(
		(accumulator, { tierId }) => {
			accumulator[tierId] = { price: formatTicketPrice(activePhase.prices[tierId]) };
			return accumulator;
		},
		{} as Record<TicketTierId, TicketCardPrice>
	);
}
