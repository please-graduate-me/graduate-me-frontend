import { useState, type ReactNode } from 'react';
import { Icon } from '../primitives/Icon';
import * as styles from './Collapsible.css';

/** 네이티브 details로 펼침 상태와 키보드 조작을 브라우저에 맡기는 접이식 영역이며 toggleLabel이 있으면 오른쪽에 "펼쳐 보기" 알약을 둔다. */
export function Collapsible({
  trigger,
  toggleLabel,
  children,
  defaultIsOpen = false,
  isOpen,
  onOpenChange,
  className,
  id,
}: {
  trigger: ReactNode;
  toggleLabel?: { closed: string; open: string };
  children?: ReactNode;
  defaultIsOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
  id?: string;
}) {
  // 초기값 의미를 지키려고 첫 렌더링 값만 기억해 이후 defaultIsOpen 변화가 사용자 조작을 덮지 않게 한다.
  const [initial] = useState(defaultIsOpen);

  return (
    <details
      id={id}
      open={isOpen ?? initial}
      className={[styles.root, className].filter(Boolean).join(' ')}
      onToggle={(event) => onOpenChange?.(event.currentTarget.open)}>
      <summary
        className={
          toggleLabel
            ? `${styles.summary} ${styles.pillSummary}`
            : styles.summary
        }>
        <span className={styles.trigger}>{trigger}</span>
        {toggleLabel ? (
          <span className={styles.pill}>
            <span className={styles.closedLabel}>{toggleLabel.closed}</span>
            <span className={styles.openLabel}>{toggleLabel.open}</span>
            <Icon
              name='chevron-down'
              size={16}
              className={styles.chevron}
            />
          </span>
        ) : (
          <Icon
            name='chevron-down'
            size={18}
            className={styles.chevron}
          />
        )}
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
