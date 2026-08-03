'use client';

import { useState } from 'react';
import { FAQ_ITEMS } from './FAQ.data';
import s from './FAQ.module.scss';

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section className={s.faq}>
			<div className="container">
				<h2 className={s.heading} data-reveal>
					Поширені запитання
				</h2>

				<div className={s.list} data-reveal>
					{FAQ_ITEMS.map((item, index) => {
						const isOpen = openIndex === index;
						return (
							<div key={item.question} className={s.item}>
								<button
									type="button"
									className={s.question}
									aria-expanded={isOpen}
									onClick={() => setOpenIndex(isOpen ? null : index)}
								>
									<span>{item.question}</span>
									<span className={s.toggle}>{isOpen ? '−' : '+'}</span>
								</button>
								{isOpen && <p className={s.answer}>{item.answer}</p>}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
