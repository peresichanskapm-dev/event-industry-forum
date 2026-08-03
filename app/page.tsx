import type { Metadata } from 'next';
import HomePage from '@/components/pages/HomePage';

export const metadata: Metadata = {
	title: 'EIF27 — Event Industry Forum',
	description: 'Event Industry Forum 2027. 25 лютого 2027, Київ, КВЦ «Парковий».',
	alternates: {
		canonical: '/',
	},
};

export default function Home() {
	return <HomePage />;
}
