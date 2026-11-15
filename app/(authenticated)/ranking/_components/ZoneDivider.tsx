import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './ZoneDivider.css';

/** 리그 순위 목록에서 승급 구간 끝과 강등 구간 시작을 가로선과 표지로 나눈다. */
export function ZoneDivider({ zone }: { zone: 'promotion' | 'demotion' }) {
  return (
    <li
      aria-hidden='true'
      className={`${styles.root} ${styles.tone[zone]}`}>
      <span className={styles.line} />
      <span className={styles.label}>
        <Icon
          name={zone === 'promotion' ? 'arrow-up' : 'chevron-down'}
          size={14}
        />
        {zone === 'promotion' ? '승급 구간' : '강등 구간'}
      </span>
      <span className={styles.line} />
    </li>
  );
}
