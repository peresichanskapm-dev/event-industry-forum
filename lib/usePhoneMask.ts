'use client';

import { useCallback, useMemo, useState, type ChangeEvent, type FocusEvent, type KeyboardEvent, type MouseEvent } from 'react';
import { formatPhoneFromUserDigits, getPhoneUserDigits, PHONE_MAX_USER_DIGITS } from './phoneMask';

function placeCaretAtEnd(input: HTMLInputElement) {
	requestAnimationFrame(() => {
		const end = input.value.length;
		input.setSelectionRange(end, end);
	});
}

export function usePhoneMask(initialValue = '') {
	const [userDigits, setUserDigits] = useState(() => getPhoneUserDigits(initialValue));

	const value = useMemo(() => formatPhoneFromUserDigits(userDigits), [userDigits]);

	const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setUserDigits(getPhoneUserDigits(event.currentTarget.value));
	}, []);

	const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Backspace' || event.key === 'Delete') {
			event.preventDefault();
			setUserDigits((prev) => prev.slice(0, -1));
		}
	}, []);

	const onFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
		placeCaretAtEnd(event.currentTarget);
	}, []);

	const onClick = useCallback((event: MouseEvent<HTMLInputElement>) => {
		placeCaretAtEnd(event.currentTarget);
	}, []);

	const reset = useCallback(() => {
		setUserDigits('');
	}, []);

	return {
		value,
		isComplete: userDigits.length === PHONE_MAX_USER_DIGITS,
		reset,
		bind: {
			value,
			onChange,
			onKeyDown,
			onFocus,
			onClick,
		},
	};
}
