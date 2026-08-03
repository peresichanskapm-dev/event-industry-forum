'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';

type Variant = 'primary' | 'secondary';

type CommonProps = {
	variant?: Variant;
	className?: string;
	children: ReactNode;
	wide?: boolean;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function Button(props: ButtonProps | AnchorProps) {
	const { variant = 'primary', className, children, wide, ...rest } = props;
	const classes = [styles.button, styles[variant], wide ? styles.wide : undefined, className].filter(Boolean).join(' ');

	if (typeof props.href === 'string') {
		const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
		return (
			<a className={classes} {...anchorProps} href={props.href}>
				{children}
			</a>
		);
	}

	return (
		<button className={classes} type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
			{children}
		</button>
	);
}
