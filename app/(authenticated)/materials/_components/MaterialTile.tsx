'use client';
import { ClickableCard } from '@/components/ui/composites/ClickableCard';
import { ProgressBar } from '@/components/ui/primitives/ProgressBar';
import { Text } from '@/components/ui/primitives/Text';
import type { ReactNode } from 'react';
import { MaterialArt } from './MaterialArt';
import * as styles from './MaterialTile.css';

/** PDF·영상 자료와 수업 과제를 그림, 제목, 진행 막대, 한 줄 요약이 있는 타일로 보여 준다. */
export function MaterialTile({
  kind,
  seed,
  href,
  title,
  progress,
  progressLabel,
  caption,
  captionTone = 'muted',
  complete,
  pill,
  hint,
  action,
}: {
  kind: 'pdf' | 'video';
  seed: string;
  href: string;
  title: string;
  progress?: number;
  progressLabel?: string;
  caption: ReactNode;
  captionTone?: 'muted' | 'accent' | 'warning' | 'error';
  complete?: 'ink' | 'accent';
  pill?: { label: string; tone: 'accent' | 'warning' };
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <li className={styles.item}>
      <ClickableCard
        href={href}
        label={pill ? `${title}, ${pill.label}` : title}
        padding={3}
        hasHoverBorder
        liftDistance={3}
        title={hint}
        className={styles.tile}>
        {pill && (
          <span
            aria-hidden='true'
            className={`${styles.pill} ${styles.pillTone[pill.tone]}`}>
            {pill.label}
          </span>
        )}
        <div className={styles.body}>
          <MaterialArt
            kind={kind}
            seed={seed}
            complete={complete}
            className={styles.art}
          />
          <Text
            as='h3'
            size='sm'
            weight='bold'
            maxLines={2}>
            {title}
          </Text>
          {progress !== undefined && (
            <ProgressBar
              label={progressLabel ?? title}
              isLabelHidden
              value={progress}
              max={100}
              className={styles.progress}
            />
          )}
          <span
            className={`${styles.caption} ${styles.captionTone[captionTone]}`}>
            {caption}
          </span>
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </ClickableCard>
    </li>
  );
}
