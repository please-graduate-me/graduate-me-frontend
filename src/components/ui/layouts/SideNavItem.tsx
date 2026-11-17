import { RouterAnchor } from '@/components/ui/primitives/RouterAnchor';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '../primitives/Icon';
import * as styles from './SideNavItem.css';

/** 사이드바 이동 링크나 보기 전환 버튼이며 선택되면 링크는 aria-current, 버튼은 aria-pressed로 알린다. */
export function SideNavItem({
  label,
  icon,
  endContent,
  href,
  onClick,
  isSelected = false,
  className,
}: {
  label: string;
  icon?: IconName;
  endContent?: ReactNode;
  href?: string;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}) {
  const classes = [styles.item, className].filter(Boolean).join(' ');

  const content = (
    <>
      {icon && (
        <Icon
          name={icon}
          size={18}
        />
      )}
      <span className={styles.label}>{label}</span>
      {endContent != null && <span className={styles.end}>{endContent}</span>}
    </>
  );

  if (href)
    return (
      <RouterAnchor
        href={href}
        aria-current={isSelected ? 'page' : undefined}
        className={classes}
        onClick={onClick}>
        {content}
      </RouterAnchor>
    );

  return (
    <button
      type='button'
      aria-pressed={isSelected}
      className={classes}
      onClick={onClick}>
      {content}
    </button>
  );
}
