'use client';

import { useEffect, useState } from 'react';

function getCurrentQueryString(): string {
	if (typeof window === 'undefined') {
		return '';
	}

	return window.location.search.replace(/^\?/, '');
}

export function useClientQueryString(): string {
	const [queryString, setQueryString] = useState('');

	useEffect(() => {
		const updateQueryString = () => {
			setQueryString(getCurrentQueryString());
		};

		updateQueryString();
		window.addEventListener('popstate', updateQueryString);
		window.addEventListener('hashchange', updateQueryString);

		return () => {
			window.removeEventListener('popstate', updateQueryString);
			window.removeEventListener('hashchange', updateQueryString);
		};
	}, []);

	return queryString;
}

export function appendQueryToHref(href: string, queryString: string): string {
	if (!queryString) {
		return href;
	}

	const isExternal = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(href) || /^(?:mailto|tel):/i.test(href);
	const shouldPreserveQuery = href.startsWith('/') && !href.includes('?') && !isExternal;

	if (!shouldPreserveQuery) {
		return href;
	}

	const hashIndex = href.indexOf('#');
	const baseHref = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
	const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';

	return `${baseHref}?${queryString}${hash}`;
}
