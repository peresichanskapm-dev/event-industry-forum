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
		role: 'З питань програми:',
		name: 'Тетяна Білоцеркович',
		phone: '+380 99 127 53 56',
		phoneHref: '+380991275356',
	},
	{
		role: 'З питань квитків:',
		name: 'Віталіна Радзієвська',
		phone: '+380 93 744 11 00',
		phoneHref: '+380937441100',
	},
	{
		role: 'З питань партнерства та участі в експо:',
		name: 'Віра Димид',
		phone: '+380 98 040 52 92',
		phoneHref: '+380980405292',
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
