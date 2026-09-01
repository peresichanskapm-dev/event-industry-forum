import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Hero from '@/components/home/Hero/Hero';
import About from '@/components/home/About/About';
import Stats from '@/components/home/Stats/Stats';
import History from '@/components/home/History/History';
import Tracks from '@/components/home/Tracks/Tracks';
import Expo from '@/components/home/Expo/Expo';
import Speakers from '@/components/home/Speakers/Speakers';
import Tickets from '@/components/home/Tickets/Tickets';
import PricingSchedule from '@/components/home/PricingSchedule/PricingSchedule';
import GeneralPartner from '@/components/home/GeneralPartner/GeneralPartner';
import FAQ from '@/components/home/FAQ/FAQ';
import Contact from '@/components/home/Contact/Contact';
import ScrollReveal from '@/components/ui/ScrollReveal/ScrollReveal';
import styles from '@/app/page.module.scss';

export default function HomePage() {
	return (
		<div className={styles.page}>
			<Header />
			<main className={styles.main}>
				<Hero />
				<About />
				<Stats />
				<History />
				<Tracks />
				<Expo />
				<Speakers />
				<Tickets />
				<PricingSchedule />
				<GeneralPartner />
				<FAQ />
				<Contact />
			</main>
			<Footer />
			<ScrollReveal />
		</div>
	);
}
