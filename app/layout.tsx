import type { Metadata } from 'next';
import { steppe, fallback } from './fonts';
import './globals.scss';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: 'EIF27 — Event Industry Forum',
	description: '',
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
