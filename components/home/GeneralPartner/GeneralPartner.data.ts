export type PartnerTextSegment = {
	text: string;
	style?: 'name' | 'nameGreen' | 'accent' | 'tagline';
	href?: string;
};

export type PartnerBlock = {
	id: string;
	heading: string;
	logo: {
		src: string;
		alt: string;
		width: number;
		height: number;
		desktopWidth: string;
	};
	paragraphs: PartnerTextSegment[][];
};

export const PARTNER_BLOCKS: PartnerBlock[] = [
	{
		id: 'general-partner',
		heading: 'Ексклюзивний партнер-локація',
		logo: {
			src: '/img/partners/emily-logo.svg',
			alt: 'Emily Resort',
			width: 200,
			height: 70,
			desktopWidth: '29.1rem',
		},
		paragraphs: [
			[
				{
					text: 'Emily Resort – сучасний багатофункціональний комплекс для відпочинку, розваг, занять спортом та оздоровлення всієї сім’ї цілий рік.',
					style: 'accent',
				},
			],
		],
	},
	{
		id: 'hotel-partners',
		heading: 'Готелі партнери',
		logo: {
			src: '/img/partners/city-inn-logo.webp',
			alt: 'City Inn Lviv',
			width: 308,
			height: 307,
			desktopWidth: '15.5rem',
		},
		paragraphs: [
			[
				{ text: 'City Inn', style: 'nameGreen' },
				{ text: ' — сучасний смарт-готель у Винниках, ідеальний для бізнесу й відпочинку.' },
			],
			[
				{
					text: 'Спеціально для гостей Event Industry Forum ми підготували промокод Global10 на 10% знижку на проживання в період з 24.02.2027 до 27.02.2027. Бронювання на офіційному сайті ',
				},
				{ text: 'www.city-inn.com.ua', href: 'https://www.city-inn.com.ua' },
				{
					text: '. Для гарантії бронювання готель зв’яжеться для організації оплати першої ночі проживання.',
				},
			],
			[{ text: 'Чекаємо у City Inn — з кавою, комфортом і чесним сервісом.', style: 'tagline' }],
		],
	},
	{
		id: 'water-partner',
		heading: 'Водний партнер',
		logo: {
			src: '/img/partners/morshynska-logo.webp',
			alt: 'Моршинська',
			width: 1854,
			height: 307,
			desktopWidth: '29.1rem',
		},
		paragraphs: [
			[
				{ text: 'Природна мінеральна ' },
				{ text: 'Моршинська', style: 'name' },
				{ text: ' — джерело сили та відновлення на шляху до Щасливої Країни Майбутнього.' },
			],
		],
	},
];
