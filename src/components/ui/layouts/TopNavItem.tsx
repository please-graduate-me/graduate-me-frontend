import { RouterAnchor } from '@/components/ui/primitives/RouterAnchor';
import * as styles from './TopNavItem.css';

/** 상단 막대의 주요 메뉴 링크이며 선택되면 aria-current로 현재 위치를 알린다. */
export function TopNavItem({
  href,
  label,
  isSelected = false,
}: {
  href: string;
  label: string;
  isSelected?: boolean;
}) {
  return (
    <RouterAnchor
      href={href}
      aria-current={isSelected ? 'page' : undefined}
      className={styles.item}>
      {label}
    </RouterAnchor>
  );
}
