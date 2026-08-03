import type { ComponentType } from 'react';
import { InstagramIcon, FacebookIcon, TelegramIcon } from '@/components/ui/icons/SocialIcons';

export type FooterContact = {
	role: string;
	name: string;
	phone: string;
	phoneHref: string;
};

export const FOOTER_CONTACTS: FooterContact[] = [
	{
		role: 'З усіх питань:',
		name: 'Віталіна',
		phone: '+380 93 744 11 00',
		phoneHref: '+380937441100',
	},
];

export type FooterSocial = {
	name: string;
	href: string;
	Icon: ComponentType;
};

export const FOOTER_SOCIALS: FooterSocial[] = [
	{ name: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
	{ name: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
	{ name: 'Telegram', href: 'https://t.me', Icon: TelegramIcon },
];
