import { ClickableCard } from '@/components/ui/composites/ClickableCard';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import type { Courses } from '@/domains/courses/model/contracts';
import * as styles from './CourseTile.css';

const roles = {
  teacher: { label: '교수·담당자', tone: 'review' },
  assistant: { label: '조교', tone: 'info' },
  student: { label: '수강생', tone: 'success' },
} as const;

const boards = ['ink', 'info', 'review'] as const;
const badges = ['accent', 'highlight', 'notice'] as const;

/** 같은 수업은 늘 같은 칠판 색을 갖도록 식별자로 색 조합을 고른다. */
function paletteIndex(id: string) {
  let hash = 0;

  for (const char of id) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) | 0;

  return Math.abs(hash);
}

/** 참여한 수업 하나를 칠판 그림, 언어와 내 역할이 보이는 이동 타일로 표시한다. */
export function CourseTile({ item }: { item: Courses['items'][number] }) {
  const role = roles[item.role];
  const index = paletteIndex(item.id);
  const board = styles.board[boards[index % boards.length]];
  // 칠판과 표지 색이 같은 순서로 맞물리지 않도록 표지는 다른 몫으로 고른다.
  const badge = styles.badge[badges[Math.floor(index / 3) % badges.length]];

  return (
    <ClickableCard
      href={`/courses/${encodeURIComponent(item.id)}`}
      label={`${item.title} 과제 확인`}
      hasHoverBorder
      liftDistance={3}
      className={styles.tile}>
      <svg
        aria-hidden='true'
        className={styles.art}
        width='80'
        height='64'
        viewBox='0 0 80 64'>
        <rect
          className={board}
          x='4'
          y='6'
          width='64'
          height='44'
          rx='10'
        />
        <rect
          className={styles.boardLine}
          x='14'
          y='18'
          width='30'
          height='5'
          rx='2.5'
        />
        <rect
          className={styles.boardLine}
          x='14'
          y='29'
          width='20'
          height='5'
          rx='2.5'
          opacity='.7'
        />
        <rect
          className={board}
          x='30'
          y='50'
          width='12'
          height='8'
        />
        <circle
          className={badge}
          cx='64'
          cy='48'
          r='13'
        />
        <text
          className={styles.badgeText}
          x='64'
          y='53'
          textAnchor='middle'
          fontWeight='700'
          fontSize='13'>
          {item.language.toUpperCase()}
        </text>
      </svg>
      <span className={styles.tileTitle}>{item.title}</span>
      <span className={styles.chips}>
        <Badge tone='neutral'>
          {item.language === 'en' ? '영어' : '태국어'}
        </Badge>
        <Badge tone={role.tone}>{role.label}</Badge>
      </span>
      <span className={styles.go}>
        과제 확인
        <Icon
          name='arrow-right'
          size={16}
        />
      </span>
    </ClickableCard>
  );
}
