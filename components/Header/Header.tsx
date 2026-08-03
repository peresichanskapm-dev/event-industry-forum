'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { setLeadSource } from '@/lib/leadSource';
import styles from './Header.module.scss';
import { NAV_ITEMS } from './Header.data';

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		let ticking = false;
		let lastValue = false;

		const updateScrolledState = () => {
			const nextValue = window.scrollY >= 80;
			if (nextValue !== lastValue) {
				lastValue = nextValue;
				setIsScrolled(nextValue);
			}
			ticking = false;
		};

		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			window.requestAnimationFrame(updateScrolledState);
		};

		updateScrolledState();
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, []);

	useEffect(() => {
		document.body.style.overflow = isMenuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isMenuOpen]);

	return (
		<header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
			<div className={`container ${styles.inner}`}>
				<Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
					<Image src="/img/logo.svg" alt="EIF27 — Event Industry Forum" width={115} height={41} priority />
				</Link>
				<nav className={styles.menu} aria-label="Головна навігація">
					<div className={styles.menuList}>
						{NAV_ITEMS.map((item) => (
							<a key={item.anchor} href={item.anchor} className={styles.menuLink} onClick={() => setIsMenuOpen(false)}>
								{item.label}
							</a>
						))}
					</div>
				</nav>
				<button
					type="button"
					className={`${styles.burger} ${isMenuOpen ? styles.burgerOpen : ''}`}
					aria-label="Меню"
					aria-expanded={isMenuOpen}
					onClick={() => setIsMenuOpen((open) => !open)}
				>
					<span />
				</button>
			</div>

			{isMounted &&
				createPortal(
					<>
						<div className={`${styles.mobilePanel} ${isMenuOpen ? styles.mobilePanelOpen : ''}`}>
							<button type="button" className={styles.mobileClose} aria-label="Закрити меню" onClick={() => setIsMenuOpen(false)}>
								<span />
							</button>
							<nav className={styles.mobileMenuList} aria-label="Мобільна навігація">
								{NAV_ITEMS.map((item) => (
									<a key={item.anchor} href={item.anchor} className={styles.mobileMenuLink} onClick={() => setIsMenuOpen(false)}>
										{item.label}
									</a>
								))}
							</nav>
							<div className={styles.mobileActions}>
								<a
									href="#form"
									className={styles.mobileButtonPrimary}
									onClick={() => {
										setLeadSource({ formSource: 'Мобільне меню — Купити квиток' });
										setIsMenuOpen(false);
									}}
								>
									Купити квиток
								</a>
								<a
									href="#form"
									className={styles.mobileButtonSecondary}
									onClick={() => {
										setLeadSource({ formSource: 'Мобільне меню — Стати партнером' });
										setIsMenuOpen(false);
									}}
								>
									Стати партнером
								</a>
							</div>
						</div>
						<div className={`${styles.backdrop} ${isMenuOpen ? styles.backdropActive : ''}`} onClick={() => setIsMenuOpen(false)} />
					</>,
					document.body
				)}
		</header>
	);
}
