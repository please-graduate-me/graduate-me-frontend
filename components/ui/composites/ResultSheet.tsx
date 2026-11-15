import type { ReactNode } from 'react';
import * as styles from './ResultSheet.css';

/** 채점 결과를 화면 아래에서 올라오는 시트로 알리며 도장·XP 같은 그림과 보조·주 버튼 자리를 둔다. */
export function ResultSheet({
  tone,
  title,
  description,
  media,
  actions,
  className,
}: {
  tone: 'success' | 'warning';
  title: ReactNode;
  description?: ReactNode;
  media?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  const classes = [styles.root, styles.tone[tone], className];

  return (
    <section
      role='status'
      aria-live='polite'
      className={classes.filter(Boolean).join(' ')}>
      <div className={styles.inner}>
        {media != null && (
          <span
            aria-hidden='true'
            className={styles.media}>
            {media}
          </span>
        )}
        <div className={`${styles.text} ${styles.textTone[tone]}`}>
          <p className={styles.title}>{title}</p>
          {description != null && (
            <div className={styles.description}>{description}</div>
          )}
        </div>
        {actions != null && <div className={styles.actions}>{actions}</div>}
      </div>
    </section>
  );
}
