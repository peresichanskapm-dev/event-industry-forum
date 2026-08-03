'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button/Button';
import { setLeadSource } from '@/lib/leadSource';
import type { TicketPackage } from './Tickets.data';
import s from './Tickets.module.scss';

type Props = {
	pack: TicketPackage;
	price: string;
};

export default function TicketCard({ pack, price }: Props) {
	const [isExpanded, setIsExpanded] = useState(false);
	const isTruncated = Boolean(pack.previewCount) && pack.features.length > (pack.previewCount ?? 0);
	const visibleFeatures = isTruncated && !isExpanded ? pack.features.slice(0, pack.previewCount) : pack.features;

	return (
		<article className={s.card}>
			<header className={s.header}>
				<h3 className={s.title}>{pack.title}</h3>
				<p className={s.price}>{price}</p>
			</header>
			<div className={s.divider} />
			<div className={`${s.listWrap} ${isTruncated && !isExpanded ? s.listWrapFaded : ''}`}>
				<ul className={s.list}>
					{visibleFeatures.map((feature) => (
						<li key={feature}>{feature}</li>
					))}
				</ul>
			</div>
			{isTruncated && (
				<button type="button" className={s.readMore} onClick={() => setIsExpanded((value) => !value)}>
					{isExpanded ? 'Згорнути' : 'Читати повністю...'}
				</button>
			)}
			<div className={s.actions}>
				<Button
					href="#form"
					className={s.button}
					wide
					onClick={() => setLeadSource({ formSource: `Квиток — ${pack.title}`, ticketTitle: pack.title })}
				>
					Купити {pack.title}
				</Button>
			</div>
		</article>
	);
}
