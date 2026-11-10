'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useState } from 'react';
import Link from 'next/link';
import { getLearningInsights } from '@/domains/learning/api/insights';
import type { LearningInsights } from '@/domains/learning/model/insights';
import { formatDate } from '@/domains/learning/lib/format';
import { Button } from '@/components/ui/primitives/Button';
import { Select } from '@/components/ui/primitives/Select';
import { Badge } from '@/components/ui/primitives/Badge';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import * as styles from '@/lib/styles/workspace.css';

/** 관찰 통계에서 실제 오답과 원문으로 돌아가며 근거 없는 진단을 만들지 않는다. */
export function LearningInsightsPanel({
  initial,
}: {
  initial: LearningInsights;
}) {
  const [value, setValue] = useState(initial);
  const [language, setLanguage] = useState(initial.language);
  const [days, setDays] = useState(initial.days);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  async function refresh(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      setValue(await getLearningInsights(language, days));
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>내 학습 분석</h1>
          <p className={styles.description}>
            실제 받아쓰기 답안에서 반복되는 어려움과 복습할 구절을 확인하세요.
          </p>
        </div>
        <Badge tone='neutral'>개인 기록 · 규칙 기반 관찰</Badge>
      </div>
      <form
        className={styles.filters}
        onSubmit={(event) => void refresh(event)}>
        <label className={styles.field}>
          학습 언어
          <Select
            value={language}
            disabled={busy}
            onChange={(event) =>
              setLanguage(event.target.value as typeof language)
            }>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
        </label>
        <label className={styles.field}>
          집계 기간
          <Select
            value={days}
            disabled={busy}
            onChange={(event) => setDays(Number(event.target.value))}>
            {[7, 30, 90].map((day) => (
              <option
                key={day}
                value={day}>
                최근 {day}일
              </option>
            ))}
          </Select>
        </label>
        <Button loading={busy}>조건 적용</Button>
      </form>
      {sessionExpired && <SessionRecovery />}
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
      <section className={styles.panel}>
        <h2>
          {value.language === 'en' ? '영어' : '태국어'} · 최근 {value.days}일
        </h2>
        <p>
          {formatDate(value.since)}부터 · 학습 {value.daysStudied}일 · 전체{' '}
          {value.sampleSize}회 제출
        </p>
        <p>
          도움 없는 시도 {value.unassistedSamples}회 · 정답 {value.correct}회 ·
          정답률{' '}
          {value.accuracy === null
            ? '계산할 기록 없음'
            : `${Math.round(value.accuracy)}%`}
        </p>
        <p className={styles.meta}>
          {value.basis} · 도움 사용 제외 {value.excludedAssisted}회 · 분류 기준{' '}
          {value.classificationVersion}
        </p>
        {value.insufficientData && (
          <p className={styles.notice}>
            아직 근거가 적어 참고 수준으로 표시합니다. 능력이나 학습 원인을
            확정하는 진단이 아닙니다.
          </p>
        )}
        <div className={styles.row}>
          {value.categories.map((item) => (
            <Badge
              key={item.category}
              tone='warning'>
              {item.category} {item.count}회
            </Badge>
          ))}
        </div>
      </section>
      <section>
        <h2>실제 오답에서 다시 듣기</h2>
        {!value.review.length ? (
          <EmptyState
            title='복습할 오답 근거가 없어요'
            description='받아쓰기를 제출하면 도움 없이 틀린 구절을 여기서 확인할 수 있습니다.'
            icon='headphones'
          />
        ) : (
          value.review.map((item) => (
            <article
              className={styles.message}
              key={item.evidence.id}>
              <div className={styles.row}>
                <h3>{item.evidence.title}</h3>
                <Badge tone='warning'>{item.category}</Badge>
              </div>
              <p className={styles.meta}>
                시도 {item.attempts}회 중 오답 {item.mistakes}회 · 원문 v
                {item.evidence.sourceVersion} ·{' '}
                {formatDate(item.evidence.createdAt)}
              </p>
              <p>
                당시 답안:{' '}
                {Array.isArray(item.evidence.answer)
                  ? item.evidence.answer.join(' / ')
                  : item.evidence.answer || '(미입력)'}
              </p>
              <blockquote className={styles.quote}>
                {item.evidence.sourceText}
              </blockquote>
              <Link
                className={styles.link}
                href={item.href}>
                해당 원문에서 다시 듣고 복습하기 ↗
              </Link>
            </article>
          ))
        )}
      </section>
      <section className={styles.panel}>
        <h2>학년별 권장 로드맵</h2>
        <p className={styles.notice}>{value.roadmapBasis}</p>
        {value.roadmap.map((item) => (
          <article key={item.year}>
            <h3>
              {item.year}학년 · {item.title}
            </h3>
            <p>{item.goal}</p>
          </article>
        ))}
        <Link href='/settings'>학습 언어와 목표 설정</Link>
      </section>
    </div>
  );
}
