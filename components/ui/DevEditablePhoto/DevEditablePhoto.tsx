'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './DevEditablePhoto.module.scss';

type Rect = {
	top: number;
	left: number;
	width: number;
	height: number;
};

type Props = {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
	storageKey: string;
} & HTMLAttributes<HTMLDivElement>;

const ROOT_FONT_SIZE = 10;
const BADGE_HEIGHT = 44;
const BADGE_WIDTH = 320;

function round(value: number): number {
	return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function readInitialRotation(el: HTMLElement): number {
	const transform = window.getComputedStyle(el).transform;
	if (!transform || transform === 'none') return 0;

	const match = transform.match(/^matrix\(([^)]+)\)$/);
	if (!match) return 0;

	const [a, b] = match[1].split(',').map(Number);
	return round((Math.atan2(b, a) * 180) / Math.PI);
}

export default function DevEditablePhoto({ children, className, style, storageKey, ...rest }: Props) {
	const [editMode, setEditMode] = useState(false);
	const [rect, setRect] = useState<Rect | null>(null);
	const [rotation, setRotation] = useState(0);
	const [badgeTick, setBadgeTick] = useState(0);
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLElement | null>(null);
	const dragRef = useRef<{
		startX: number;
		startY: number;
		startRect: Rect;
		mode: 'move' | 'resize' | 'rotate';
	} | null>(null);
	const initialRef = useRef<{ rect: Rect; rotation: number } | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		setEditMode(params.get('edit') === '1');
	}, []);

	useEffect(() => {
		if (!editMode || rect) return;

		const node = wrapperRef.current;
		if (!node) return;

		containerRef.current = (node.offsetParent as HTMLElement) ?? node.parentElement;

		const saved = window.localStorage.getItem(storageKey);
		if (saved) {
			try {
				const parsed = JSON.parse(saved) as { rect: Rect; rotation: number };
				setRect(parsed.rect);
				setRotation(parsed.rotation);
				if (!initialRef.current) {
					initialRef.current = parsed;
				}
				return;
			} catch {
				// fall through to measuring
			}
		}

		const measured = { top: node.offsetTop, left: node.offsetLeft, width: node.offsetWidth, height: node.offsetHeight };
		const measuredRotation = readInitialRotation(node);
		initialRef.current = { rect: measured, rotation: measuredRotation };
		setRect(measured);
		setRotation(measuredRotation);
	}, [editMode, rect, storageKey]);

	useEffect(() => {
		if (rect) {
			window.localStorage.setItem(storageKey, JSON.stringify({ rect, rotation }));
		}
	}, [rect, rotation, storageKey]);

	useEffect(() => {
		if (!editMode || !rect) return;

		const onViewportChange = () => setBadgeTick((tick) => tick + 1);
		window.addEventListener('scroll', onViewportChange, { passive: true, capture: true });
		window.addEventListener('resize', onViewportChange);
		return () => {
			window.removeEventListener('scroll', onViewportChange, true);
			window.removeEventListener('resize', onViewportChange);
		};
	}, [editMode, rect]);

	const onPointerMove = useCallback((event: PointerEvent) => {
		const drag = dragRef.current;
		if (!drag) return;

		if (drag.mode === 'rotate') {
			const container = containerRef.current;
			const containerRect = container?.getBoundingClientRect();
			const centerX = (containerRect?.left ?? 0) + drag.startRect.left + drag.startRect.width / 2;
			const centerY = (containerRect?.top ?? 0) + drag.startRect.top + drag.startRect.height / 2;
			const angle = (Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180) / Math.PI;
			setRotation(round(angle + 90));
			return;
		}

		const deltaX = event.clientX - drag.startX;
		const deltaY = event.clientY - drag.startY;

		if (drag.mode === 'move') {
			setRect({ ...drag.startRect, top: drag.startRect.top + deltaY, left: drag.startRect.left + deltaX });
		} else {
			setRect({
				...drag.startRect,
				width: Math.max(40, drag.startRect.width + deltaX),
				height: Math.max(40, drag.startRect.height + deltaY),
			});
		}
	}, []);

	const onPointerUp = useCallback(() => {
		dragRef.current = null;
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerUp);
	}, [onPointerMove]);

	const startDrag = (mode: 'move' | 'resize' | 'rotate') => (event: React.PointerEvent) => {
		if (!rect) return;
		event.preventDefault();
		event.stopPropagation();
		dragRef.current = { startX: event.clientX, startY: event.clientY, startRect: rect, mode };
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);
	};

	const resetRect = () => {
		window.localStorage.removeItem(storageKey);
		if (initialRef.current) {
			setRect({ ...initialRef.current.rect });
			setRotation(initialRef.current.rotation);
		}
	};

	const copyCss = async () => {
		if (!rect) return;

		const css = [
			`top: ${round(rect.top / ROOT_FONT_SIZE)}rem;`,
			`left: ${round(rect.left / ROOT_FONT_SIZE)}rem;`,
			`right: auto;`,
			`bottom: auto;`,
			`width: ${round(rect.width / ROOT_FONT_SIZE)}rem;`,
			`height: ${round(rect.height / ROOT_FONT_SIZE)}rem;`,
			`transform: rotate(${round(rotation)}deg);`,
		].join('\n');

		await navigator.clipboard.writeText(css);
	};

	if (!editMode) {
		return (
			<div className={className} style={style} {...rest}>
				{children}
			</div>
		);
	}

	// data-reveal (via ScrollReveal) writes its own inline transform on this same node once it
	// scrolls into view, which would stomp our rotation. Keep rotation on an inner div instead —
	// ScrollReveal only ever touches elements carrying the data-reveal attribute itself.
	const appliedStyle: CSSProperties = rect
		? {
				...style,
				position: 'absolute',
				top: rect.top,
				left: rect.left,
				right: 'auto',
				bottom: 'auto',
				width: rect.width,
				height: rect.height,
				overflow: 'visible',
				zIndex: 999,
			}
		: { ...style, visibility: 'hidden' };

	const rotateStyle: CSSProperties = { width: '100%', height: '100%', transform: `rotate(${rotation}deg)` };

	// Portaled to <body> as position:fixed so it's never clipped by an ancestor's overflow:hidden
	// (e.g. .visual) — badgeTick just forces a re-read of the live screen position on scroll/resize.
	void badgeTick;
	const wrapperScreenRect = wrapperRef.current?.getBoundingClientRect();
	const badgeStyle: CSSProperties | undefined = wrapperScreenRect
		? {
				top:
					wrapperScreenRect.top - BADGE_HEIGHT >= 8
						? wrapperScreenRect.top - BADGE_HEIGHT
						: clamp(wrapperScreenRect.top + 8, 8, window.innerHeight - BADGE_HEIGHT - 8),
				left: clamp(wrapperScreenRect.left, 8, window.innerWidth - BADGE_WIDTH - 8),
			}
		: undefined;

	return (
		<div ref={wrapperRef} className={className} style={appliedStyle} {...rest}>
			<div style={rotateStyle}>{children}</div>

			<div className={styles.moveHandle} onPointerDown={startDrag('move')} />
			<div className={styles.resizeHandle} onPointerDown={startDrag('resize')} />
			<div className={styles.rotateHandle} onPointerDown={startDrag('rotate')} />

			{rect &&
				createPortal(
					<div className={styles.badge} style={badgeStyle}>
						<span>
							{Math.round(rect.width)}×{Math.round(rect.height)} @ {Math.round(rect.left)},{Math.round(rect.top)} ∠{Math.round(rotation)}°
						</span>
						<button type="button" onClick={copyCss}>
							Copy CSS
						</button>
						<button type="button" onClick={resetRect}>
							Reset
						</button>
					</div>,
					document.body
				)}
		</div>
	);
}
