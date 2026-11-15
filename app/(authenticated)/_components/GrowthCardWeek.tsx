import { Icon } from '@/components/ui/primitives/Icon';
import { VisuallyHidden } from '@/components/ui/primitives/VisuallyHidden';
import type { GrowthSummary } from '@/domains/growth/model/contracts';
import * as styles from './GrowthCardWeek.css';

const weekdays = ['월', '화', '수', '목', '금', '토', '일'];

/** 이번 주 월요일부터 7칸에 목표 달성일은 체크, 오늘은 고리, 학습만 한 날은 옅은 칸으로 연속 기록을 보여 준다. */
export function GrowthCardWeek({ days }: { days: GrowthSummary['weekDays'] }) {
  return (
    <ol
      aria-label='이번 주 학습 기록'
      className={styles.list}>
      {days.map((day, index) => {
        const state = day.goalReached
          ? 'done'
          : day.today
            ? 'today'
            : day.studied
              ? 'studied'
              : 'idle';

        return (
          <li
            key={day.day}
            aria-current={day.today ? 'date' : undefined}
            className={styles.day}>
            <span className={`${styles.dot} ${styles.dotState[state]}`}>
              {day.goalReached && (
                <Icon
                  name='check'
                  size={14}
                />
              )}
            </span>
            <span
              className={
                day.today ? `${styles.label} ${styles.today}` : styles.label
              }>
              {weekdays[index]}
            </span>
            <VisuallyHidden>
              {day.goalReached
                ? ' 목표 달성'
                : day.studied
                  ? ' 학습함'
                  : day.today
                    ? ' 오늘'
                    : ' 기록 없음'}
            </VisuallyHidden>
          </li>
        );
      })}
    </ol>
  );
}
