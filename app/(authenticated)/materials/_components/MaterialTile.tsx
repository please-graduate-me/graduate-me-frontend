'use client';
import { ClickableCard } from '@/components/ui/composites/ClickableCard';
import { ProgressBar } from '@/components/ui/primitives/ProgressBar';
import { Text } from '@/components/ui/primitives/Text';
import type { ReactNode } from 'react';
import * as styles from './MaterialTile.css';

/** PDF와 영상 자료를 장식 그림, 제목, 실제 진도와 상태가 있는 타일로 보여 준다. */
export function MaterialTile({
  kind,
  href,
  title,
  progress,
  progressLabel,
  complete = false,
  details,
  status,
  action,
}: {
  kind: 'pdf' | 'video';
  href: string;
  title: string;
  progress: number;
  progressLabel: string;
  complete?: boolean;
  details: ReactNode;
  status: ReactNode;
  action?: ReactNode;
}) {
  return (
    <li className={styles.item}>
      <ClickableCard
        href={href}
        label={title}
        padding={3}
        className={styles.tile}>
        <div className={styles.body}>
          {kind === 'pdf' ? (
            <svg
              aria-hidden='true'
              className={styles.art}
              width='72'
              height='64'
              viewBox='0 0 72 64'>
              <rect
                x='22'
                y='2'
                width='40'
                height='52'
                rx='8'
                fill='#C9C2FB'
              />
              <rect
                x='12'
                y='10'
                width='40'
                height='52'
                rx='8'
                fill='#8B7CF6'
              />
              <rect
                x='20'
                y='24'
                width='22'
                height='5'
                rx='2.5'
                fill='#FFFFFF'
              />
              <rect
                x='20'
                y='34'
                width='16'
                height='5'
                rx='2.5'
                fill='#FFFFFF'
              />
              <rect
                x='20'
                y='44'
                width='20'
                height='5'
                rx='2.5'
                fill='#FFFFFF'
              />
            </svg>
          ) : (
            <svg
              aria-hidden='true'
              className={styles.art}
              width='72'
              height='64'
              viewBox='0 0 72 64'>
              <rect
                x='6'
                y='8'
                width='60'
                height='42'
                rx='10'
                fill='#16181D'
              />
              <path
                d='M30 20v18l15-9-15-9z'
                fill='#12A47F'
              />
              {complete ? (
                <>
                  <circle
                    cx='58'
                    cy='50'
                    r='10'
                    fill='#12A47F'
                  />
                  <path
                    d='m54 50 3 3 5-6'
                    stroke='#FFFFFF'
                    strokeWidth='2.4'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </>
              ) : (
                <>
                  <rect
                    x='0'
                    y='40'
                    width='30'
                    height='16'
                    rx='6'
                    fill='#FFFFFF'
                    stroke='#DADCE1'
                    strokeWidth='2'
                  />
                  <rect
                    x='6'
                    y='46'
                    width='14'
                    height='4'
                    rx='2'
                    fill='#F97316'
                  />
                </>
              )}
            </svg>
          )}
          <Text
            as='h3'
            size='sm'
            weight='bold'
            maxLines={2}>
            {title}
          </Text>
          <ProgressBar
            label={progressLabel}
            isLabelHidden
            value={progress}
            max={100}
            className={styles.progress}
          />
          <div className={styles.details}>{details}</div>
          <div className={styles.status}>{status}</div>
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </ClickableCard>
    </li>
  );
}
