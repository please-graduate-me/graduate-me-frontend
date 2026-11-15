'use client';
import { DropdownMenu } from '@/components/ui/composites/DropdownMenu';
import { IconButton } from '@/components/ui/primitives/IconButton';
import * as styles from './PdfZoomControl.css';

/** PDF 확대 상태이며 숫자는 배율, width·page는 화면 맞춤이다. */
export type PdfZoom = number | 'width' | 'page';

const steps = [0.5, 0.75, 1, 1.25, 1.5, 2];

// 맞춤 배율에서 눌러도 지금 보이는 크기에서 한 단계씩 움직이도록 0.25 단위로 맞춘다.
const step = (scale: number, delta: number) =>
  Math.min(2, Math.max(0.5, Math.round((scale + delta) * 4) / 4));

/** 헤더 오른쪽의 축소·배율·확대 알약 묶음이며 가운데 배율을 누르면 맞춤과 고정 배율을 고른다. */
export function PdfZoomControl({
  zoom,
  scale,
  onZoom,
}: {
  zoom: PdfZoom;
  scale: number;
  onZoom: (zoom: PdfZoom) => void;
}) {
  const percent = Math.round(scale * 100);

  return (
    <div
      role='group'
      aria-label='PDF 확대율'
      className={styles.root}>
      <IconButton
        label='축소'
        name='minus'
        disabled={scale <= 0.5}
        onClick={() => onZoom(step(scale, -0.25))}
      />
      <DropdownMenu
        alignment='center'
        button={{
          label: `${percent}%`,
          variant: 'ghost',
          size: 'sm',
          className: styles.value,
        }}
        items={[
          {
            id: 'page',
            label: zoom === 'page' ? '페이지에 맞춤 (현재)' : '페이지에 맞춤',
            onClick: () => onZoom('page'),
          },
          {
            id: 'width',
            label: zoom === 'width' ? '너비에 맞춤 (현재)' : '너비에 맞춤',
            onClick: () => onZoom('width'),
          },
          ...steps.map((value) => ({
            id: String(value),
            label: `${Math.round(value * 100)}%${zoom === value ? ' (현재)' : ''}`,
            onClick: () => onZoom(value),
          })),
        ]}
      />
      <IconButton
        label='확대'
        name='plus'
        disabled={scale >= 2}
        onClick={() => onZoom(step(scale, 0.25))}
      />
    </div>
  );
}
