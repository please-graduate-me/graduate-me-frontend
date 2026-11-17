import { Banner } from '@/components/ui/composites/Banner';
import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import type { LearningInsights } from '@/domains/learning/model/insights';
import { formatDate } from '@/domains/learning/lib/format';
import { AccuracyRing } from './AccuracyRing';
import * as styles from './InsightsSummary.css';

/** 선택 조건의 정답률, 제출 구성, 오답 차이 분류를 실제 집계 값으로 그린다. */
export function InsightsSummary({ value }: { value: LearningInsights }) {
  const wrong = Math.max(value.unassistedSamples - value.correct, 0);
  // 서버 집계 사이 반올림 차이가 있어도 막대가 넘치지 않게 실제 구간 합을 분모로 쓴다.
  const total = value.correct + wrong + value.excludedAssisted;
  const share = (count: number) => (total ? (count / total) * 100 : 0);
  const top = Math.max(0, ...value.categories.map((item) => item.count));

  const parts = [
    { kind: 'correct', label: '정답', count: value.correct },
    { kind: 'wrong', label: '도움 없이 오답', count: wrong },
    {
      kind: 'excluded',
      label: '도움 사용 제외',
      count: value.excludedAssisted,
    },
  ] as const;

  return (
    <Card
      as='section'
      aria-labelledby='insights-summary-title'
      className={styles.root}>
      <div>
        <Heading
          level={2}
          id='insights-summary-title'
          className={styles.title}>
          {value.language === 'en' ? '영어' : '태국어'} · 최근 {value.days}일
        </Heading>
        <Text
          as='p'
          display='block'
          className={styles.since}>
          {formatDate(value.since)}부터 · 학습 {value.daysStudied}일 · 전체{' '}
          {value.sampleSize}회 제출
        </Text>
      </div>
      <div className={styles.figures}>
        <div className={styles.accuracy}>
          <AccuracyRing accuracy={value.accuracy} />
          <div>
            <Text
              as='p'
              display='block'
              color='secondary'
              className={styles.accuracyLabel}>
              정답률
            </Text>
            <Text
              as='p'
              display='block'
              className={styles.accuracyText}>
              도움 없는 시도 <strong>{value.unassistedSamples}회</strong> · 정답{' '}
              <strong>{value.correct}회</strong>
            </Text>
          </div>
        </div>
        <dl className={styles.stats}>
          {(
            [
              ['학습한 날', value.daysStudied, '일'],
              ['전체 제출', value.sampleSize, '회'],
              ['도움 사용 제외', value.excludedAssisted, '회'],
            ] as const
          ).map(([label, count, unit]) => (
            <div
              key={label}
              className={styles.stat}>
              <dt className={styles.statLabel}>{label}</dt>
              <dd className={styles.statValue}>
                {count}
                <span className={styles.unit}>{unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <figure className={styles.figure}>
        <figcaption className={styles.caption}>제출 구성</figcaption>
        <div
          role='img'
          aria-label={`전체 ${total}회 중 정답 ${value.correct}회, 도움 없이 오답 ${wrong}회, 도움 사용 제외 ${value.excludedAssisted}회`}
          className={styles.stack}>
          {parts.map((part) =>
            part.count ? (
              <div
                key={part.kind}
                title={`${part.label} ${part.count}회`}
                className={styles.segment}
                data-kind={part.kind}
                style={{ width: `${share(part.count).toFixed(1)}%` }}
              />
            ) : null
          )}
        </div>
        <ul
          aria-hidden='true'
          className={styles.legend}>
          {parts.map((part) => (
            <li
              key={part.kind}
              className={styles.legendItem}>
              <span
                className={styles.swatch}
                data-kind={part.kind}
              />
              {part.label}{' '}
              <span className={styles.legendValue}>{part.count}</span>
            </li>
          ))}
        </ul>
      </figure>
      {value.insufficientData && (
        <Banner
          status='quote'
          icon='info'
          layout='inline'
          title='안내'
          role='note'>
          아직 근거가 적어 참고 수준으로 표시합니다. 능력이나 학습 원인을
          확정하는 진단이 아닙니다.
        </Banner>
      )}
      {value.categories.length > 0 && (
        <figure className={styles.figure}>
          <figcaption className={styles.caption}>
            도움 없이 틀린 답안의 차이 분류
          </figcaption>
          <ul className={styles.categories}>
            {value.categories.map((item) => (
              <li
                key={item.category}
                className={styles.categoryRow}>
                <span className={styles.categoryName}>{item.category}</span>
                <span
                  aria-hidden='true'
                  className={styles.categoryTrack}>
                  <span
                    className={styles.categoryBar}
                    style={{
                      width: `${top ? ((item.count / top) * 100).toFixed(1) : 0}%`,
                    }}
                  />
                </span>
                <span className={styles.categoryCount}>{item.count}회</span>
              </li>
            ))}
          </ul>
        </figure>
      )}
      <Text
        as='p'
        display='block'
        color='secondary'
        className={styles.basis}>
        {value.basis} · 도움 사용 제외 {value.excludedAssisted}회 · 분류 기준{' '}
        {value.classificationVersion}
      </Text>
    </Card>
  );
}
