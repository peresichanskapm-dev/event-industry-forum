import localFont from 'next/font/local';
import { Inter } from 'next/font/google';

export const steppe = localFont({
	variable: '--font-steppe',
	src: [
		{ path: './fonts/steppe/Steppe-Regular.ttf', weight: '400', style: 'normal' },
		{ path: './fonts/steppe/Steppe-Medium.ttf', weight: '500', style: 'normal' },
		{ path: './fonts/steppe/Steppe-SemiBold.ttf', weight: '600', style: 'normal' },
		{ path: './fonts/steppe/Steppe-Bold.ttf', weight: '700', style: 'normal' },
	],
});

export const fallback = Inter({
	variable: '--font-fallback',
	subsets: ['latin', 'cyrillic'],
	weight: ['400', '500', '600', '700'],
});
