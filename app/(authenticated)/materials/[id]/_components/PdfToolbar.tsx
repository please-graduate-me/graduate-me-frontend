'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/primitives/Icon';
import { IconButton } from '@/components/ui/primitives/IconButton';
import * as styles from './PdfToolbar.css';

/** 페이지 입력과 확대 메뉴를 실제 PDF 좌표 이동에 연결한다. */
export function PdfToolbar({
  page,
  total,
  zoom,
  selectionMode,
  memoOpen,
  thumbnailsOpen,
  onPage,
  onZoom,
  onSelectionMode,
  onMemo,
  onThumbnails,
  onHighlight,
  hasSelection,
}: {
  page: number;
  total: number;
  zoom: number | 'width' | 'page';
  selectionMode: boolean;
  memoOpen: boolean;
  thumbnailsOpen: boolean;
  onPage: (page: number) => void;
  onZoom: (zoom: number | 'width' | 'page') => void;
  onSelectionMode: (value: boolean) => void;
  onMemo: () => void;
  onThumbnails: () => void;
  onHighlight: () => void;
  hasSelection: boolean;
}) {
  const [draft, setDraft] = useState(String(page));
  const [previous, setPrevious] = useState(page);
  const [invalid, setInvalid] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  if (previous !== page) {
    setPrevious(page);
    setDraft(String(page));
    setInvalid(false);
  }

  useEffect(() => {
    if (!open) return;

    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !menu.current?.contains(event.target))
        setOpen(false);
    }

    document.addEventListener('pointerdown', outside);

    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);

  function commitPage() {
    const number = Number(draft);

    if (!Number.isInteger(number) || number < 1 || number > total)
      return setInvalid(true);
    setInvalid(false);
    onPage(number);
  }

  const zoomLabel =
    typeof zoom === 'number'
      ? `${Math.round(zoom * 100)}%`
      : zoom === 'width'
        ? '너비에 맞춤'
        : '페이지 맞춤';

  return (
    <div
      className={styles.toolbar}
      aria-label='PDF 읽기 도구'>
      <IconButton
        label={thumbnailsOpen ? '페이지 목록 닫기' : '페이지 목록 열기'}
        name='panel-left'
        selected={thumbnailsOpen}
        onClick={onThumbnails}
      />
      <div className={styles.pageControl}>
        <IconButton
          label='이전 페이지'
          name='chevron-left'
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        />
        <input
          className={styles.pageInput}
          aria-label='현재 페이지'
          aria-invalid={invalid}
          aria-describedby={invalid ? 'page-input-error' : undefined}
          inputMode='numeric'
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitPage}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitPage();

            if (event.key === 'Escape') {
              setDraft(String(page));
              setInvalid(false);
            }
          }}
        />
        <span className={styles.total}>/ {total}</span>
        <IconButton
          label='다음 페이지'
          name='chevron-right'
          disabled={page >= total}
          onClick={() => onPage(page + 1)}
        />
      </div>
      <span className={styles.divider} />
      <div className={styles.zoomControls}>
        <IconButton
          label='축소'
          name='minus'
          disabled={typeof zoom === 'number' && zoom <= 0.5}
          onClick={() =>
            onZoom(Math.max(0.5, (typeof zoom === 'number' ? zoom : 1) - 0.25))
          }
        />
        <div
          className={styles.zoomRoot}
          ref={menu}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setOpen(false);
          }}>
          <button
            type='button'
            className={styles.zoomButton}
            aria-expanded={open}
            aria-controls='pdf-zoom-menu'
            onClick={() => setOpen((value) => !value)}>
            {zoomLabel}
            <Icon
              name='chevron-down'
              size={16}
            />
          </button>
          {open && (
            <div
              id='pdf-zoom-menu'
              className={styles.menu}
              aria-label='PDF 확대율'>
              {(
                [
                  ['page', '페이지에 맞춤'],
                  ['width', '너비에 맞춤'],
                  [0.5, '50%'],
                  [0.75, '75%'],
                  [1, '100%'],
                  [1.25, '125%'],
                  [1.5, '150%'],
                  [2, '200%'],
                ] as const
              ).map(([value, label]) => (
                <button
                  type='button'
                  key={value}
                  className={styles.menuItem}
                  aria-pressed={zoom === value}
                  onClick={() => {
                    onZoom(value);
                    setOpen(false);
                  }}>
                  {label}
                  {zoom === value && (
                    <Icon
                      name='check'
                      size={16}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <IconButton
          label='확대'
          name='plus'
          disabled={typeof zoom === 'number' && zoom >= 2}
          onClick={() =>
            onZoom(Math.min(2, (typeof zoom === 'number' ? zoom : 1) + 0.25))
          }
        />
      </div>
      <span className={styles.divider} />
      <IconButton
        label='텍스트 선택 모드'
        name='mouse-pointer-2'
        selected={selectionMode}
        onClick={() => onSelectionMode(!selectionMode)}
      />
      <IconButton
        label='선택한 구절 하이라이트'
        name='highlighter'
        disabled={!hasSelection}
        onClick={onHighlight}
      />
      <div className={styles.spacer} />
      <IconButton
        label={memoOpen ? '구절 패널로 돌아가기' : '개인 메모 열기'}
        name='message-circle'
        selected={memoOpen}
        onClick={onMemo}
      />
      <span className={styles.total}>메모</span>
      {invalid && (
        <span
          id='page-input-error'
          className={styles.error}
          role='alert'>
          1~{total}페이지를 입력해 주세요.
        </span>
      )}
    </div>
  );
}
