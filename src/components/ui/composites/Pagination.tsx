import { Button } from '../primitives/Button';
import * as styles from './Pagination.css';

/** 이전·다음 알약 버튼과 현재 페이지 표기를 nav 랜드마크로 묶는다. */
export function Pagination({
  page,
  totalPages,
  hasPrevious = page > 1,
  hasNext = totalPages === undefined ? false : page < totalPages,
  onPageChange,
  label = '페이지 이동',
  isDisabled = false,
}: {
  page: number;
  totalPages?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPageChange: (page: number) => void;
  label?: string;
  isDisabled?: boolean;
}) {
  return (
    <nav
      aria-label={label}
      className={styles.root}>
      <Button
        type='button'
        variant='secondary'
        startIcon='chevron-left'
        disabled={isDisabled || !hasPrevious}
        onClick={() => onPageChange(page - 1)}>
        이전
      </Button>
      <span
        aria-current='page'
        className={styles.current}>
        {totalPages === undefined
          ? `${page}페이지`
          : `${page} / ${totalPages}페이지`}
      </span>
      <Button
        type='button'
        variant='secondary'
        endIcon='chevron-right'
        disabled={isDisabled || !hasNext}
        onClick={() => onPageChange(page + 1)}>
        다음
      </Button>
    </nav>
  );
}
