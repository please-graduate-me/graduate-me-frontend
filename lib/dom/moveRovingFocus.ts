import type { KeyboardEvent } from 'react';

const keys = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
]);

/** 화살표·Home·End로 묶음 안의 다음 활성 항목에 초점을 옮기고 선택한다. */
export function moveRovingFocus(
  event: KeyboardEvent<HTMLElement>,
  itemSelector: string
) {
  if (!keys.has(event.key)) return;

  const items = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(itemSelector)
  ).filter((item) => !item.hasAttribute('disabled'));

  if (!items.length) return;
  event.preventDefault();
  const current = items.findIndex((item) => item === document.activeElement);

  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? (Math.max(current, 0) - 1 + items.length) % items.length
          : (current + 1) % items.length;

  items[next].focus();
  // 초점 이동과 함께 선택해 탭·분할 선택의 자동 활성화 패턴을 따른다.
  items[next].click();
}
