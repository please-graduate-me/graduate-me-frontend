'use client';
import { useState } from 'react';
import type { ExerciseResult } from '@/domains/ai/model/contracts';
import { listExerciseAttempts } from '@/domains/ai/api/learning';
import { Button } from '@/components/ui/primitives/Button';
import { Badge } from '@/components/ui/primitives/Badge';
import { formatDate } from '@/domains/learning/lib/format';
import * as styles from '@/lib/styles/workspace.css';

/** 문제 수정 이후에도 제출 당시 버전·답안·정답·근거를 구분해 확인한다. */
export function ExerciseAttempts({
  id,
  reload,
}: {
  id: string;
  reload: number;
}) {
  const [items, setItems] = useState<ExerciseResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [previous, setPrevious] = useState(reload);

  if (previous !== reload) {
    setPrevious(reload);
    setItems([]);
  }

  async function load() {
    setBusy(true);
    setError('');

    try {
      setItems((await listExerciseAttempts(id)).items);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <details>
      <summary>이 문제의 과거 제출 기록</summary>
      <div className={styles.stack}>
        <Button
          size='small'
          variant='secondary'
          disabled={busy}
          onClick={() => void load()}>
          기록 조회
        </Button>
        {error && (
          <p
            className={styles.error}
            role='alert'>
            {error}
          </p>
        )}
        {items.map((item) => (
          <article
            key={item.id}
            className={styles.message}>
            <div className={styles.row}>
              <Badge
                tone={
                  item.correct === true
                    ? 'success'
                    : item.correct === false
                      ? 'warning'
                      : 'brand'
                }>
                {item.correct === null
                  ? '자유답변 피드백'
                  : item.correct
                    ? '정답'
                    : '오답'}
              </Badge>
              <span className={styles.meta}>
                문제 v{item.version} · {formatDate(item.createdAt)}
              </span>
            </div>
            <p className={styles.prose}>내 답안: {item.answer}</p>
            <p className={styles.prose}>
              당시 기준 답안: {item.expectedAnswer}
            </p>
            <p className={styles.prose}>{item.explanation}</p>
            {item.feedback && <p className={styles.notice}>{item.feedback}</p>}
            <p className={styles.meta}>
              {item.hintUsed ? '힌트 사용' : '힌트 사용 안 함'} ·{' '}
              {item.revealed ? '정답 열람 후 제출' : '정답 열람 전 제출'}
            </p>
            <blockquote className={styles.quote}>
              {item.source.quote}
            </blockquote>
          </article>
        ))}
      </div>
    </details>
  );
}
