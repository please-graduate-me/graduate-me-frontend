'use client';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import {
  useLayoutEffect,
  useRef,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import * as styles from './Tooltip.css';

type Placement = 'above' | 'below' | 'start' | 'end';
type Alignment = 'start' | 'center' | 'end';

const gap = 6;
const edge = 8;

const sides = {
  above: 'top',
  below: 'bottom',
  start: 'left',
  end: 'right',
} as const;

/** 기준 요소의 화면 좌표에서 말풍선 위치를 계산하고 화면 밖으로 나가지 않게 자른다. */
function position(
  anchor: DOMRect,
  tip: DOMRect,
  placement: Placement,
  alignment: Alignment
) {
  const vertical = placement === 'above' || placement === 'below';

  const along = (start: number, size: number, tipSize: number) =>
    alignment === 'start'
      ? start
      : alignment === 'end'
        ? start + size - tipSize
        : start + (size - tipSize) / 2;

  const left = vertical
    ? along(anchor.left, anchor.width, tip.width)
    : placement === 'start'
      ? anchor.left - tip.width - gap
      : anchor.right + gap;

  const top = vertical
    ? placement === 'above'
      ? anchor.top - tip.height - gap
      : anchor.bottom + gap
    : along(anchor.top, anchor.height, tip.height);

  const clamp = (value: number, max: number) =>
    Math.min(Math.max(value, edge), Math.max(edge, max - edge));

  return {
    left: clamp(left, window.innerWidth - tip.width),
    top: clamp(top, window.innerHeight - tip.height),
  };
}

/** 자식 조작에 붙는 설명 말풍선이며, anchorRef와 isOpen을 주면 외부 요소 위치에 직접 띄운다. */
export function Tooltip({
  content,
  children,
  anchorRef,
  isOpen,
  placement = 'above',
  alignment = 'center',
  delay = 400,
}: {
  content: ReactNode;
  children?: ReactElement;
  anchorRef?: RefObject<HTMLElement | null>;
  isOpen?: boolean;
  placement?: Placement;
  alignment?: Alignment;
  delay?: number;
}) {
  const tip = useRef<HTMLDivElement>(null);
  const anchoredOpen = anchorRef !== undefined && isOpen === true;

  // 기준 요소가 렌더링마다 움직일 수 있어 그릴 때마다 좌표를 다시 맞춘다.
  useLayoutEffect(() => {
    if (!anchoredOpen) return;

    function place() {
      const anchor = anchorRef?.current;
      const element = tip.current;

      if (!anchor || !element) return;

      const next = position(
        anchor.getBoundingClientRect(),
        element.getBoundingClientRect(),
        placement,
        alignment
      );

      element.style.left = `${next.left}px`;
      element.style.top = `${next.top}px`;
    }

    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);

    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  });

  if (anchorRef !== undefined) {
    if (!anchoredOpen || typeof document === 'undefined') return null;

    return createPortal(
      <div
        ref={tip}
        role='tooltip'
        className={`${styles.content} ${styles.anchored}`}>
        {content}
      </div>,
      document.body
    );
  }

  return (
    <RadixTooltip.Provider delayDuration={delay}>
      <RadixTooltip.Root open={isOpen}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={sides[placement]}
            align={alignment}
            sideOffset={gap}
            collisionPadding={edge}
            className={styles.content}>
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
