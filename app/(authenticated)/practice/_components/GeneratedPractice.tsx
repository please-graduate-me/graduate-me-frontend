'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useRef, useState } from 'react';
import type { Exercise } from '@/domains/ai/model/contracts';
import type { Expression } from '@/domains/expressions/model/contracts';
import { generateExercises, listExercises } from '@/domains/ai/api/learning';
import { Button } from '@/components/ui/primitives/Button';
import { Select } from '@/components/ui/primitives/Select';
import { Badge } from '@/components/ui/primitives/Badge';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { ExerciseSolver } from './ExerciseSolver';
import * as styles from '@/lib/styles/workspace.css';

/** 명시적 새 문제 생성과 저장 문제의 재풀이·오답 복습을 구분한다. */
export function GeneratedPractice({
  initial,
  expressions,
  selectedExerciseId,
  selectedExpressionId,
  initialLanguage = 'en',
}: {
  initial: Exercise[];
  expressions: Expression[];
  selectedExerciseId?: string;
  selectedExpressionId?: string;
  initialLanguage?: 'en' | 'th';
}) {
  const [items, setItems] = useState(initial);

  const [selected, setSelected] = useState(
    selectedExerciseId || initial[0]?.id || ''
  );

  const [language, setLanguage] = useState<'en' | 'th'>(initialLanguage);

  const [type, setType] = useState<'choice' | 'short_answer' | 'free_response'>(
    'choice'
  );

  const [count, setCount] = useState(1);

  const [expressionIds, setExpressionIds] = useState<string[]>(
    selectedExpressionId ? [selectedExpressionId] : []
  );

  const [filter, setFilter] = useState<
    'all' | 'wrong' | 'unanswered' | 'excluded'
  >(
    initial.find((item) => item.id === selectedExerciseId)?.state.excluded
      ? 'excluded'
      : 'all'
  );

  const [busy, setBusy] = useState(false);
  const request = useRef<{ key: string; id: string } | null>(null);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  const eligible = expressions.filter(
    (item) => item.source.language === language && item.reviewIncluded
  );

  const filtered = items.filter(
    (item) =>
      item.source.language === language &&
      (filter === 'excluded' ? item.state.excluded : !item.state.excluded) &&
      (filter === 'wrong'
        ? item.latestResult?.correct === false
        : filter === 'unanswered'
          ? !item.latestResult
          : true)
  );

  const unavailable = Boolean(
    selectedExerciseId && !items.some((item) => item.id === selectedExerciseId)
  );

  const current = filtered.find((item) => item.id === selected) || filtered[0];

  async function generate() {
    if (!expressionIds.length || busy) return;
    setBusy(true);
    setError('');
    setSessionExpired(false);

    try {
      const key = JSON.stringify([expressionIds, language, type, count]);

      if (request.current?.key !== key)
        request.current = { key, id: crypto.randomUUID() };

      const result = await generateExercises({
        requestId: request.current.id,
        expressionIds,
        language,
        type,
        count,
      });

      setItems((previous) => [
        ...result.items,
        ...previous.filter(
          (item) => !result.items.some((value) => value.id === item.id)
        ),
      ]);

      request.current = null;
      setFilter('all');
      setSelected(result.items[0]?.id || '');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    setBusy(true);
    setError('');
    setSessionExpired(false);

    try {
      setItems((await listExercises()).items);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.stack}>
      {sessionExpired && <SessionRecovery />}
      <div className={styles.heading}>
        <div>
          <h1>적용 연습 · 복습</h1>
          <p className={styles.description}>
            PDF·영상의 저장 표현과 실제 오답을 바탕으로 짧게 적용해 보세요.
          </p>
        </div>
        <Badge tone='brand'>저장 문제 재풀이는 AI 호출 없음</Badge>
      </div>
      {unavailable && (
        <p
          className={styles.notice}
          role='status'>
          요청한 문제는 삭제되었거나 조회할 수 없습니다. 저장된 다른 문제 목록을
          확인해 주세요.
        </p>
      )}
      <section className={styles.panel}>
        <h2>새 적용 문제 요청</h2>
        <div className={styles.filters}>
          <label className={styles.field}>
            학습 언어
            <Select
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value as typeof language);
                setExpressionIds([]);
              }}>
              <option value='en'>영어</option>
              <option value='th'>태국어</option>
            </Select>
          </label>
          <label className={styles.field}>
            유형
            <Select
              value={type}
              onChange={(event) => setType(event.target.value as typeof type)}>
              <option value='choice'>객관식 이해·적용</option>
              <option value='short_answer'>짧은 정답형</option>
              <option value='free_response'>자유답변 피드백</option>
            </Select>
          </label>
          <label className={styles.field}>
            문제 수
            <Select
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}>
              {[1, 2, 3, 4, 5].map((value) => (
                <option
                  key={value}
                  value={value}>
                  {value}개
                </option>
              ))}
            </Select>
          </label>
        </div>
        <p className={styles.meta}>
          출제에 사용할 저장 항목을 선택하세요. 서버는 같은 언어의 실제 오답과
          미복습 항목을 우선 참고합니다.
        </p>
        <div className={styles.stack}>
          {eligible.slice(0, 50).map((item) => (
            <label
              className={styles.row}
              key={item.id}>
              <input
                type='checkbox'
                checked={expressionIds.includes(item.id)}
                onChange={(event) =>
                  setExpressionIds((previous) =>
                    event.target.checked
                      ? [...previous, item.id]
                      : previous.filter((id) => id !== item.id)
                  )
                }
              />
              {item.text}
              <span className={styles.meta}>{item.source.title}</span>
            </label>
          ))}
        </div>
        {!eligible.length && (
          <p className={styles.notice}>
            이 언어에 복습할 저장 표현이 없습니다. 원문에서 표현을 저장하거나
            원문 AI 패널에서 바로 문제를 요청해 보세요.
          </p>
        )}
        <div className={styles.row}>
          <Button
            disabled={busy || !expressionIds.length}
            loading={busy}
            onClick={() => void generate()}>
            선택 항목으로 새 문제 생성
          </Button>
          <Button
            variant='secondary'
            disabled={busy}
            onClick={() => void refresh()}>
            저장 문제 새로 조회
          </Button>
        </div>
        {error && (
          <p
            role='alert'
            className={styles.error}>
            {error}
            <Button
              size='small'
              variant='ghost'
              disabled={busy || !expressionIds.length}
              onClick={() => {
                request.current = null;
                void generate();
              }}>
              새 문제로 다시 요청
            </Button>
          </p>
        )}
      </section>
      <div className={styles.tabs}>
        {(
          [
            ['all', '복습할 문제'],
            ['wrong', '오답'],
            ['unanswered', '아직 풀지 않은 문제'],
            ['excluded', '복습에서 제외'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type='button'
            className={styles.tab}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}>
            {label}
          </button>
        ))}
      </div>
      {!filtered.length ? (
        <EmptyState
          icon='repeat-2'
          title='이 조건의 저장 문제가 없어요'
          description='새 문제 요청 또는 다른 복습 조건을 선택해 보세요.'
        />
      ) : (
        <div className={styles.columns}>
          <ul className={styles.list}>
            {filtered.map((item) => (
              <li key={item.id}>
                <button
                  type='button'
                  className={styles.listItem}
                  aria-pressed={current?.id === item.id}
                  onClick={() => setSelected(item.id)}>
                  <strong>{item.payload.question}</strong>
                  <p className={styles.meta}>
                    {item.source.title} · v{item.version} ·{' '}
                    {item.status === 'suspended'
                      ? '새 풀이 중단'
                      : item.latestResult?.correct === false
                        ? '오답 복습'
                        : item.latestResult
                          ? '풀이 기록 있음'
                          : '미풀이'}
                  </p>
                </button>
              </li>
            ))}
          </ul>
          {current && (
            <ExerciseSolver
              key={current.id + ':' + current.version}
              exercise={current}
              onChange={(value) =>
                setItems((previous) =>
                  previous.map((item) => (item.id === value.id ? value : item))
                )
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
