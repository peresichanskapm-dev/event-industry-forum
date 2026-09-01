import type { Metadata } from 'next';
import { steppe, fallback } from './fonts';
import './globals.scss';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const title = 'EIF27 — Event Industry Forum';
const description =
	'25 лютого 2027, Львів, Emily Resort. THE NEXT EXPERIENCE — головна подія української івент-індустрії: Event Expo та 8 тематичних треків.';

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title,
	description,
	openGraph: {
		title,
		description,
		url: siteUrl,
		siteName: 'EIF27',
		locale: 'uk_UA',
		type: 'website',
		images: [{ url: '/img/logo.svg' }],
	},
	twitter: {
		card: 'summary',
		title,
		description,
		images: ['/img/logo.svg'],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="uk">
			<body className={`${steppe.variable} ${fallback.variable}`}>{children}</body>
		</html>
	);
}
