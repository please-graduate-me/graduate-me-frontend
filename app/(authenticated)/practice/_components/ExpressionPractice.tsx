'use client';
import { notifyLearningReward } from '@/domains/growth/lib/rewardEvents';
import { useRef, useState } from 'react';
import Link from 'next/link';
import type { Expression } from '@/domains/expressions/model/contracts';
import { savePracticeAttempt } from '@/domains/learning/api/history';
import { materialPaths } from '@/domains/materials/config/paths';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Button } from '@/components/ui/primitives/Button';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import * as styles from '@/lib/styles/workspace.css';

/** AI 채점과 구분되는 표현 카드 자가점검을 실제 활동 기록에 저장한다. */
export function ExpressionPractice({
  expressions,
}: {
  expressions: Expression[];
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const expression = expressions[index];
  const attempt = useRef<{ key: string; id: string } | null>(null);
  const submitting = useRef(false);

  async function confirm(result: boolean) {
    if (!expression || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError('');

    try {
      const key = JSON.stringify([expression.id, answer, result]);

      // 응답 유실 후 재전송도 같은 시도로 묶고 다음 카드에서만 식별자를 버린다.
      if (attempt.current?.key !== key)
        attempt.current = { key, id: crypto.randomUUID() };

      const saved = await savePracticeAttempt({
        requestId: attempt.current.id,
        expressionId: expression.id,
        answer,
        correct: result,
      });

      notifyLearningReward(saved.reward);
      attempt.current = null;
      setCorrect((value) => value + Number(result));
      setIndex((value) => value + 1);
      setAnswer('');
      setRevealed(false);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>연습 · 복습</h1>
          <p className={styles.description}>
            내가 저장한 표현을 다시 떠올려 보세요.
          </p>
        </div>
        <Badge tone='brand'>표현 카드 · 자가점검</Badge>
      </div>
      <p className={styles.notice}>
        이 표현 카드는 자동 채점과 별도의 자가점검입니다. 원문과 저장한 뜻을
        비교해 직접 확인한 결과가 기록됩니다. AI 적용 연습은 위의 저장 문제를
        이용해 주세요.
      </p>
      {!expressions.length ? (
        <EmptyState
          icon='repeat-2'
          title='복습할 표현을 먼저 저장해 보세요'
          description='개인 표현집에 모아 둔 표현으로 시작할 수 있어요.'>
          <Link
            href='/expressions'
            className={styles.link}>
            개인 표현집으로
          </Link>
        </EmptyState>
      ) : !expression ? (
        <section className={styles.panel}>
          <Badge tone='success'>
            <Icon
              name='check-check'
              size={16}
            />
            자가점검 완료
          </Badge>
          <h2>{expressions.length}개 표현을 복습했어요.</h2>
          <p className={styles.prose}>
            기억났어요 {correct}개 · 다시 볼래요 {expressions.length - correct}
            개
          </p>
          <div className={styles.row}>
            <ButtonLink
              href='/history'
              className={styles.link}>
              활동 기록 보기
            </ButtonLink>
            <ButtonLink
              href='/expressions'
              className={styles.link}
              variant='secondary'>
              표현집으로
            </ButtonLink>
          </div>
        </section>
      ) : (
        <section className={styles.panel}>
          <div className={styles.row}>
            <Badge tone='neutral'>
              {index + 1} / {expressions.length}
            </Badge>
            <span className={styles.meta}>이 표현의 뜻을 떠올려 보세요.</span>
          </div>
          <h2 className={styles.expressionTitle}>{expression.text}</h2>
          <label className={styles.field}>
            떠오르는 뜻과 문맥
            <TextArea
              value={answer}
              disabled={revealed || busy}
              maxLength={5000}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder='어떤 상황에서 쓸 수 있었나요?'
            />
          </label>
          {!revealed ? (
            <Button onClick={() => setRevealed(true)}>뜻과 원문 확인</Button>
          ) : (
            <>
              <h3>내가 저장한 뜻</h3>
              <p className={styles.prose}>
                {expression.meaning ||
                  '저장된 뜻이 없어요. 아래 원문을 읽고 직접 확인해 주세요.'}
              </p>
              <blockquote className={styles.quote}>
                {expression.source.quote}
              </blockquote>
              <Link
                href={materialPaths.source(expression.source)}
                className={styles.link}>
                원문에서 다시 보기 ↗
              </Link>
              <p className={styles.meta}>스스로 확인한 결과를 선택해 주세요.</p>
              <div className={styles.row}>
                <Button
                  disabled={busy}
                  loading={busy}
                  onClick={() => void confirm(true)}>
                  기억났어요
                </Button>
                <Button
                  variant='secondary'
                  disabled={busy}
                  onClick={() => void confirm(false)}>
                  다시 볼래요
                </Button>
              </div>
            </>
          )}
          {error && (
            <p
              className={styles.error}
              role='alert'>
              {error}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
