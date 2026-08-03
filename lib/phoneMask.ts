export const PHONE_PREFIX = '+38(0';
export const PHONE_MAX_USER_DIGITS = 9;

const COUNTRY_CODE = '380';

export function getPhoneUserDigits(value: string): string {
	const digits = value.replace(/\D/g, '');

	let normalized = digits;
	if (normalized.startsWith(COUNTRY_CODE)) {
		normalized = normalized.slice(COUNTRY_CODE.length);
	}

	if (normalized.startsWith('0')) {
		normalized = normalized.slice(1);
	}

	return normalized.slice(0, PHONE_MAX_USER_DIGITS);
}

export function formatPhoneFromUserDigits(userDigits: string): string {
	const digits = userDigits.replace(/\D/g, '').slice(0, PHONE_MAX_USER_DIGITS);

	let result = `${PHONE_PREFIX}${digits.slice(0, 2)}`;

	if (digits.length >= 2) {
		result += ')';
	}

	const tail = digits.slice(2);
	if (tail.length > 0) {
		result += ` ${tail.slice(0, 3)}`;
	}

	if (tail.length > 3) {
		result += `-${tail.slice(3, 5)}`;
	}

	if (tail.length > 5) {
		result += `-${tail.slice(5, 7)}`;
	}

	return result;
}

export function formatPhone(value: string): string {
	return formatPhoneFromUserDigits(getPhoneUserDigits(value));
}

export function isPhoneComplete(value: string): boolean {
	return getPhoneUserDigits(value).length === PHONE_MAX_USER_DIGITS;
}
