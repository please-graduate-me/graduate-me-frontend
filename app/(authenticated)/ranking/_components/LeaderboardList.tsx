'use client';
import { Avatar } from '@astryxdesign/core/Avatar';
import { VisuallyHidden } from '@astryxdesign/core/VisuallyHidden';
import { Fragment } from 'react';
import type { Leaderboard } from '@/domains/growth/model/contracts';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './LeaderboardList.css';

/** 주간 XP 순위를 행 목록으로 보여 주고 내 행과 건너뛴 순위 구간을 구분한다. */
export function LeaderboardList({ items }: { items: Leaderboard['items'] }) {
  return (
    <ol
      aria-label='주간 XP 순위'
      className={styles.list}>
      {items.map((item, index) => {
        // 상위 20명 밖의 내 주변 순위는 전체 순번이 끊겨 오므로 생략 구간을 보여 준다.
        const skipped =
          index > 0 && item.position > items[index - 1].position + 1;

        return (
          <Fragment key={item.position}>
            {skipped && (
              <li
                aria-hidden='true'
                className={styles.gap}>
                <Icon
                  name='ellipsis'
                  size={18}
                />
              </li>
            )}
            <li
              className={item.isMe ? `${styles.row} ${styles.me}` : styles.row}>
              <span className={styles.rank}>
                {item.rank}
                <VisuallyHidden>위</VisuallyHidden>
              </span>
              {/* 닉네임을 바로 옆에서 읽으므로 이니셜 원은 보조 기술에서 숨긴다. */}
              <Avatar
                name={item.nickname}
                size='md'
                tooltip={false}
                aria-hidden='true'
              />
              <span className={styles.name}>
                {item.nickname}
                {item.isMe && <span className={styles.meTag}> (나)</span>}
              </span>
              <span className={styles.xp}>{item.xp} XP</span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
