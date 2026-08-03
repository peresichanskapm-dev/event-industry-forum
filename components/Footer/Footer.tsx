import Image from 'next/image';
import styles from './Footer.module.scss';
import { FOOTER_CONTACTS, FOOTER_SOCIALS } from './Footer.data';

export default function Footer() {
	return (
		<footer className={styles.footer} id="footer">
			<div className={`container ${styles.inner}`}>
				<div className={styles.top}>
					<div className={styles.brand}>
						<Image src="/img/logo.svg" alt="EIF27 — Event Industry Forum" width={115} height={41} />
					</div>

					<div className={styles.organizer}>
						<p className={styles.organizerLabel}>Організатор:</p>
						<Image src="/img/organizer-logo.svg" alt="Global Events" width={112} height={35} className={styles.organizerLogo} />
					</div>

					{FOOTER_CONTACTS.map((contact) => (
						<div key={contact.role} className={styles.contact}>
							<p className={styles.contactRole}>{contact.role}</p>
							<p className={styles.contactName}>{contact.name}</p>
							<a href={`tel:${contact.phoneHref}`} className={styles.contactPhone}>
								{contact.phone}
							</a>
						</div>
					))}

					<div className={styles.socials}>
						{FOOTER_SOCIALS.map((social) => (
							<a key={social.name} href={social.href} target="_blank" rel="noreferrer" aria-label={social.name} className={styles.socialLink}>
								<social.Icon />
							</a>
						))}
					</div>
				</div>

				<div className={styles.bottom}>
					<p>&copy; {new Date().getFullYear()} EIF27. All rights are reserved.</p>
					<p>Developed and supported by vau.agency.</p>
				</div>
			</div>
		</footer>
	);
}
