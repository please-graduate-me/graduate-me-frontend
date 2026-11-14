'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import * as buttonStyles from '@/lib/styles/button.css';
import { Icon } from '../primitives/Icon';
import * as styles from './TopNav.css';

/** 로고, 주요 메뉴, 끝 내용을 담는 고정 상단 막대이며 좁은 화면에서는 메뉴를 버튼 뒤 패널로 접는다. */
export function TopNav({
  label = '상단 탐색',
  heading,
  startContent,
  endContent,
}: {
  label?: string;
  heading?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // 패널 밖을 누르면 닫아 다른 화면 조작을 가리지 않게 한다.
  useEffect(() => {
    if (!open) return;

    function close(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('pointerdown', close);

    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const classes = [styles.items, open && styles.open];

  return (
    <header
      ref={header}
      className={styles.header}>
      <nav
        aria-label={label}
        className={styles.inner}
        onKeyDown={(event) => {
          if (event.key !== 'Escape' || !open) return;
          setOpen(false);
          toggle.current?.focus();
        }}>
        {heading}
        {startContent && (
          <div
            id={panelId}
            className={classes.filter(Boolean).join(' ')}
            // 링크를 고르면 이동과 함께 패널을 닫는다.
            onClick={(event) => {
              if ((event.target as Element).closest('a')) setOpen(false);
            }}>
            {startContent}
          </div>
        )}
        <div className={styles.end}>
          {endContent}
          {startContent && (
            <button
              ref={toggle}
              type='button'
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
              className={[
                buttonStyles.base,
                buttonStyles.variant.ghost,
                buttonStyles.iconOnly.medium,
                styles.toggle,
              ].join(' ')}
              onClick={() => setOpen((value) => !value)}>
              <Icon
                name={open ? 'x' : 'menu'}
                size={20}
              />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
