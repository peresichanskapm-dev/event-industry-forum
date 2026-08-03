import type { CSSProperties } from 'react';
import { PRICING_COLUMNS, getPricingRows } from '@/lib/pricingSchedule';
import s from './PricingSchedule.module.scss';

export default function PricingSchedule() {
	const rows = getPricingRows();
	const tableStyle = {
		'--pricing-column-count': PRICING_COLUMNS.length,
	} as CSSProperties;

	return (
		<section className={s.pricingSchedule} id="pricing-schedule">
			<div className="container">
				<h2 className={s.heading} data-reveal>
					Графік підвищення цін
				</h2>

				<div className={s.tableWrap} data-reveal data-reveal-delay="0.1">
					<div className={s.table} role="table" aria-label="Графік підвищення цін" style={tableStyle}>
						<div className={s.headRow} role="row">
							<div className={s.corner} role="columnheader" aria-hidden="true" />
							{PRICING_COLUMNS.map((column) => (
								<div key={column.tierId} className={s.headCell} role="columnheader">
									{column.label}
								</div>
							))}
						</div>
						{rows.map((row) => (
							<div
								key={row.phase}
								className={`${s.row} ${row.highlight ? s.highlight : ''} ${row.blur ? s.blur : ''}`}
								role="row"
								aria-current={row.isActive ? 'true' : undefined}
							>
								<div className={s.rowLabel} role="rowheader">
									<span className={s.phase}>{row.phase}</span>
									<span className={s.date}>{row.date}</span>
								</div>
								{row.values.map((value, index) => (
									<div key={`${row.phase}-${index}`} className={s.cell} role="cell">
										{value}
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
