import { Avatar } from '@/components/ui/primitives/Avatar';
import { VisuallyHidden } from '@/components/ui/primitives/VisuallyHidden';
import { Fragment } from 'react';
import type { League, Leaderboard } from '@/domains/growth/model/contracts';
import { Icon } from '@/components/ui/primitives/Icon';
import { ZoneDivider } from './ZoneDivider';
import * as styles from './LeaderboardList.css';

const numberFormat = new Intl.NumberFormat('ko-KR');

type Row = Leaderboard['items'][number] & {
  zone?: League['members'][number]['zone'];
};

/** 주간 XP 순위를 행 목록으로 보여 주고 내 행은 바탕색으로, 건너뛴 순위는 생략 표시로, 리그 승급·강등 경계는 구분선으로 나눈다. */
export function LeaderboardList({
  items,
  label = '주간 XP 순위',
}: {
  items: Row[];
  label?: string;
}) {
  return (
    <ol
      aria-label={label}
      className={styles.list}>
      {items.map((item, index) => {
        const previous = items[index - 1];
        const next = items[index + 1];
        // 상위 20명 밖의 내 주변 순위는 전체 순번이 끊겨 오므로 생략 구간을 보여 준다.
        const skipped = previous && item.position > previous.position + 1;

        const demotionStart =
          item.zone === 'demotion' && previous?.zone !== 'demotion';

        const promotionEnd =
          item.zone === 'promotion' && next && next.zone !== 'promotion';

        return (
          <Fragment key={item.position}>
            {demotionStart && <ZoneDivider zone='demotion' />}
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
              aria-current={item.isMe ? 'true' : undefined}
              className={item.isMe ? `${styles.row} ${styles.me}` : styles.row}>
              <span className={styles.rank}>
                {item.rank}
                <VisuallyHidden>위</VisuallyHidden>
              </span>
              {/* 닉네임을 바로 옆에서 읽으므로 이니셜 원은 보조 기술에서 숨긴다. */}
              <Avatar
                name={item.nickname}
                size='md'
                tone='neutral'
                tooltip={false}
                aria-hidden='true'
              />
              <span className={styles.name}>
                {item.nickname}
                {item.isMe && <VisuallyHidden> (나)</VisuallyHidden>}
                {item.zone === 'promotion' && (
                  <VisuallyHidden>, 승급 구간</VisuallyHidden>
                )}
                {item.zone === 'demotion' && (
                  <VisuallyHidden>, 강등 구간</VisuallyHidden>
                )}
              </span>
              <span className={styles.xp}>
                {numberFormat.format(item.xp)} XP
              </span>
            </li>
            {promotionEnd && <ZoneDivider zone='promotion' />}
          </Fragment>
        );
      })}
    </ol>
  );
}
