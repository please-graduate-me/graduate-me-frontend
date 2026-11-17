import { ClickableCard } from '@/components/ui/composites/ClickableCard';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './MaterialAddTile.css';

/** 타일 목록 끝에서 기존 자료 등록 창을 연다. */
export function MaterialAddTile({ onAdd }: { onAdd: () => void }) {
  return (
    <li className={styles.item}>
      <ClickableCard
        label='PDF 또는 영상 추가'
        variant='transparent'
        padding={0}
        className={styles.tile}
        onClick={onAdd}>
        <div className={styles.body}>
          <span
            aria-hidden='true'
            className={styles.plus}>
            <Icon
              name='plus'
              size={20}
            />
          </span>
          PDF 또는 영상 추가
        </div>
      </ClickableCard>
    </li>
  );
}
