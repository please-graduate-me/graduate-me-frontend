'use client';
import { Input } from '@/components/ui/primitives/Input';
import { Select } from '@/components/ui/primitives/Select';
import { Toolbar } from '@/components/ui/composites/Toolbar';
import { useState } from 'react';
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

  if (previous !== page) {
    setPrevious(page);
    setDraft(String(page));
    setInvalid(false);
  }

  function commitPage() {
    const number = Number(draft);

    if (!Number.isInteger(number) || number < 1 || number > total)
      return setInvalid(true);
    setInvalid(false);
    onPage(number);
  }

  return (
    <Toolbar
      className={styles.toolbar}
      label='PDF 읽기 도구'
      startContent={
        <>
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
            <Input
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
                onZoom(
                  Math.max(0.5, (typeof zoom === 'number' ? zoom : 1) - 0.25)
                )
              }
            />
            <Select
              aria-label='PDF 확대율'
              value={String(zoom)}
              onChange={(event) => {
                const value = event.target.value;

                onZoom(
                  value === 'width' || value === 'page' ? value : Number(value)
                );
              }}>
              <option value='page'>페이지에 맞춤</option>
              <option value='width'>너비에 맞춤</option>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((value) => (
                <option
                  key={value}
                  value={value}>
                  {Math.round(value * 100)}%
                </option>
              ))}
            </Select>
            <IconButton
              label='확대'
              name='plus'
              disabled={typeof zoom === 'number' && zoom >= 2}
              onClick={() =>
                onZoom(
                  Math.min(2, (typeof zoom === 'number' ? zoom : 1) + 0.25)
                )
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
        </>
      }
      endContent={
        <>
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
        </>
      }
    />
  );
}
