'use client';
import { useState } from 'react';
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

  async function confirm(result: boolean) {
    if (!expression || busy) return;
    setBusy(true);
    setError('');

    try {
      await savePracticeAttempt({
        expressionId: expression.id,
        answer,
        correct: result,
      });

      setCorrect((value) => value + Number(result));
      setIndex((value) => value + 1);
      setAnswer('');
      setRevealed(false);
    } catch (error) {
      setError((error as Error).message);
    } finally {
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
        AI가 만든 문제와 자동 채점은 아직 제공하지 않습니다. 원문과 저장한 뜻을
        비교해 직접 확인한 결과가 기록됩니다.
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
