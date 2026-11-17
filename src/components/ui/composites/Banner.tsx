import type { HTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../primitives/Icon';
import * as styles from './Banner.css';

/** 안내, 주의, 오류 같은 상태의 제목과 본문을 색 상자로 표시하고 앞 아이콘과 한 줄 배치를 고를 수 있다. */
export function Banner({
  status,
  title,
  icon,
  layout = 'stacked',
  isOutlined = false,
  className,
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  status: keyof typeof styles.status;
  title?: ReactNode;
  icon?: IconName;
  layout?: 'stacked' | 'inline';
  isOutlined?: boolean;
}) {
  const hasBody = children != null && children !== false;
  const hasTitle = title != null && title !== false;

  const classes = [
    styles.root,
    styles.status[status],
    isOutlined && styles.outline[status],
    className,
  ];

  return (
    <div
      {...props}
      className={classes.filter(Boolean).join(' ')}>
      {icon && (
        <Icon
          name={icon}
          size={18}
          className={`${styles.icon} ${styles.iconTone[status]}`}
        />
      )}
      <div className={layout === 'inline' ? styles.inline : styles.content}>
        {/* 본문 없이 제목만 쓰는 안내는 긴 문장이라 굵게 하지 않고 바탕색으로만 상태를 나눈다. */}
        {hasTitle && (
          <div
            className={
              [
                hasBody && styles.title,
                hasBody && styles.titleTone[status],
                layout === 'inline' && styles.inlineTitle,
              ]
                .filter(Boolean)
                .join(' ') || undefined
            }>
            {title}
          </div>
        )}
        {hasBody && <div>{children}</div>}
      </div>
    </div>
  );
}
