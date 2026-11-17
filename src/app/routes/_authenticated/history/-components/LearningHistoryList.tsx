import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Button } from '@/components/ui/primitives/Button';
import { Select } from '@/components/ui/primitives/Select';
import { Card } from '@/components/ui/primitives/Card';
import { useState } from 'react';
import { Link } from '@/components/ui/primitives/Link';
import type { LearningHistory } from '@/domains/learning/model/history';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon, type IconName } from '@/components/ui/primitives/Icon';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { RelativeTime } from '@/components/ui/primitives/RelativeTime';
import { formatAbsoluteTime } from '@/lib/date/formatRelativeTime';
import * as styles from './LearningHistoryList.css';

type Kind = LearningHistory[number]['kind'];

const labels = {
  practice: '자가점검',
  question: '질문',
  material: '자료',
  exercise: '적용 문제',
  video: '받아쓰기',
  annotation: '하이라이트·메모',
  explanation: 'AI 설명',
  conversation: 'AI 대화',
  watch: '영상 시청 위치',
} as const;

const icons: Record<Kind, IconName> = {
  practice: 'repeat-2',
  question: 'message-circle',
  material: 'file-text',
  exercise: 'sparkles',
  video: 'headphones',
  annotation: 'highlighter',
  explanation: 'lightbulb',
  conversation: 'messages-square',
  watch: 'circle-play',
};

const kinds = [
  ['all', '전체'],
  ['practice', '자가점검'],
  ['question', '질문'],
  ['material', '자료'],
  ['exercise', '적용 문제'],
  ['video', '받아쓰기'],
  ['annotation', '위치 메모'],
  ['explanation', 'AI 설명'],
  ['conversation', 'AI 대화'],
  ['watch', '영상 시청 위치'],
] as const;

const dayFormat = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
});

const timeFormat = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit',
  minute: '2-digit',
});

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

/** 활동 시각의 날짜를 오늘, 어제와 그 외 날짜로 이름 붙인다. */
function dayLabel(date: Date) {
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(today.getDate() - 1);
  const label = dayFormat.format(date);

  if (dayKey(date) === dayKey(today)) return `오늘 · ${label}`;
  if (dayKey(date) === dayKey(yesterday)) return `어제 · ${label}`;

  return label;
}

/** 24시간 안의 활동인지 판단해 상대 시각으로 보여 줄지 정한다. */
const isWithinDay = (value: string) =>
  new Date().getTime() - new Date(value).getTime() < 24 * 60 * 60 * 1000;

/** 최근 순으로 정렬된 활동을 순서를 유지한 채 날짜별로 묶는다. */
function groupByDay(items: LearningHistory) {
  const groups: { key: string; label: string; items: LearningHistory }[] = [];

  for (const item of items) {
    const date = new Date(item.createdAt);
    const key = dayKey(date);
    const last = groups.at(-1);

    if (last?.key === key) last.items.push(item);
    else groups.push({ key, label: dayLabel(date), items: [item] });
  }

  return groups;
}

/** 저장된 학습 활동과 실제 정오 판정을 별도로 보여 주고 서버가 최근 활동만 잘라 준 경우 그 사실을 알린다. */
export function LearningHistoryList({
  items,
  limit,
  truncated,
}: {
  items: LearningHistory;
  limit: number;
  truncated: boolean;
}) {
  const [language, setLanguage] = useState<'all' | 'en' | 'th'>('all');
  const [kind, setKind] = useState<'all' | Kind>('all');

  const filtered = items.filter(
    (item) =>
      (kind === 'all' || item.kind === kind) &&
      (language === 'all' || item.language === language)
  );

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <div className={styles.header}>
          <div>
            <Heading level={1}>학습 기록</Heading>
            <Text
              as='p'
              display='block'
              color='secondary'
              className={styles.description}>
              내가 읽고 질문하고 복습한 시간을 돌아보세요.
            </Text>
          </div>
          <Badge tone='neutral'>
            <Icon
              name='check'
              size={14}
            />
            실제 저장된 활동
          </Badge>
        </div>
        <div className={styles.filters}>
          <Select
            className={styles.language}
            label={contentLabel(<>학습 언어</>)}
            aria-label='학습 언어 필터'
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as typeof language)
            }>
            <option value='all'>모든 언어</option>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
          <Text
            as='p'
            color='secondary'
            role='status'
            className={styles.count}>
            최근 순{truncated ? ` · 최근 ${limit}개까지` : ''} · 활동{' '}
            {filtered.length}개
          </Text>
        </div>
        <div
          role='group'
          aria-label='활동 종류'
          className={styles.kinds}>
          {kinds.map(([value, label]) => (
            <Button
              variant='secondary'
              pressedTone='ink'
              type='button'
              key={value}
              aria-pressed={kind === value}
              onClick={() => setKind(value)}>
              {label}
            </Button>
          ))}
        </div>
        {!items.length ? (
          <EmptyState
            variant='dashed'
            iconTone='neutral'
            headingLevel={2}
            title='아직 기록된 활동이 없어요'
            description='자료를 등록하거나 원문에서 질문하고 저장한 표현을 복습해 보세요.'
            icon='chart-no-axes-column'
          />
        ) : !filtered.length ? (
          // 기록은 있는데 조건에 맞는 활동만 없으면 기록이 없는 것처럼 보이지 않게 따로 안내한다.
          <EmptyState
            variant='dashed'
            iconTone='neutral'
            headingLevel={2}
            title='이 조건의 활동이 없어요'
            description='다른 활동 종류나 언어를 선택해 보세요.'
            icon='search'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                setKind('all');
                setLanguage('all');
              }}>
              전체 보기
            </Button>
          </EmptyState>
        ) : (
          <div className={styles.days}>
            {groupByDay(filtered).map((group) => (
              <section
                key={group.key}
                aria-label={group.label}
                className={styles.day}>
                <Heading
                  level={2}
                  className={styles.dayHeading}>
                  {group.label}
                  <span className={styles.dayCount}>
                    {group.items.length}개
                  </span>
                </Heading>
                <ol className={styles.rows}>
                  {group.items.map((item) => (
                    <li
                      key={`${item.kind}:${item.id}`}
                      className={styles.row}>
                      <Badge
                        className={styles.kind}
                        tone={
                          item.kind === 'practice'
                            ? 'success'
                            : item.kind === 'question'
                              ? 'review'
                              : 'neutral'
                        }>
                        <Icon
                          name={icons[item.kind]}
                          size={14}
                        />
                        {labels[item.kind]}
                      </Badge>
                      <span className={styles.content}>
                        <strong className={styles.title}>{item.title}</strong>
                        <Text
                          display='block'
                          color='secondary'
                          className={styles.detail}>
                          {item.detail}
                        </Text>
                      </span>
                      {isWithinDay(item.createdAt) ? (
                        <RelativeTime
                          value={item.createdAt}
                          className={styles.time}
                        />
                      ) : (
                        <time
                          dateTime={item.createdAt}
                          title={formatAbsoluteTime(item.createdAt)}
                          className={styles.time}>
                          {timeFormat.format(new Date(item.createdAt))}
                        </time>
                      )}
                      <Link
                        href={item.href}
                        className={styles.link}>
                        이어서 보기 ↗
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
            {truncated && (
              <Text
                as='p'
                display='block'
                color='secondary'
                className={styles.truncated}>
                최근 활동 {limit}개까지만 보여 드려요. 더 이전 기록은 각 자료와
                표현집에서 이어서 확인할 수 있어요.
              </Text>
            )}
          </div>
        )}
      </div>
      <aside
        aria-label='기록 기준'
        className={styles.aside}>
        <Card
          as='section'
          className={styles.guide}>
          <span className={styles.guideIcon}>
            <Icon
              name='info'
              size={20}
            />
          </span>
          <Heading
            level={2}
            className={styles.guideTitle}>
            이 기록을 읽는 법
          </Heading>
          <Text
            as='p'
            display='block'
            className={styles.guideText}>
            서버에 저장된 개별 활동을 최근 {limit}개까지 최근 순으로 표시합니다.
            받아쓰기는 구절별 제출, 적용 문제는 저장 문제별 제출이며 자가점검은
            본인 판단입니다. 도움 사용과 정오 판정은 각 활동의 상세 기록에서
            확인할 수 있습니다.
          </Text>
        </Card>
      </aside>
    </div>
  );
}
