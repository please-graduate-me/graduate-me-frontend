'use client';
import { AlertDialog } from '@/components/ui/composites/AlertDialog';
import { useConfirmation } from '@/lib/hooks/useConfirmation';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Blockquote } from '@/components/ui/primitives/Blockquote';
import { Banner } from '@/components/ui/composites/Banner';
import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useId, useState } from 'react';
import { Link } from '@/components/ui/primitives/Link';
import type { Expression } from '@/domains/expressions/model/contracts';
import {
  deleteExpression,
  updateExpression,
} from '@/domains/expressions/api/expressions';
import { materialPaths } from '@/domains/materials/config/paths';
import { sourceLabel } from '@/domains/learning/lib/format';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { ExpressionReviewStatus } from './ExpressionReviewStatus';
import * as styles from './ExpressionDetail.css';

const kindNames = {
  word: '단어',
  phrase: '숙어·표현',
  sentence: '문장',
  concept: '개념',
} as const;

/** 처음 만난 문맥을 유지하며 개인의 뜻과 메모만 편집한다. */
export function ExpressionDetail({
  expression,
  onChange,
  onDelete,
}: {
  expression: Expression;
  onChange: (expression: Expression) => void;
  onDelete: () => void;
}) {
  const confirmation = useConfirmation();
  const kindLabelId = useId();
  const [editing, setEditing] = useState(false);
  const [meaning, setMeaning] = useState(expression.meaning);
  const [note, setNote] = useState(expression.note);
  const [kind, setKind] = useState(expression.kind);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      onChange(await updateExpression(expression.id, { meaning, note, kind }));
      setEditing(false);
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (
      !(await confirmation.confirm(
        '이 표현을 개인 표현집에서 삭제할까요? 원본 자료와 기존 연습 기록은 유지됩니다.',
        `“${expression.text}” 삭제`,
        { icon: 'trash-2', actionLabel: '삭제' }
      ))
    )
      return;
    setBusy(true);
    setError('');

    try {
      await deleteExpression(expression.id);
      onDelete();
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className={styles.detail}
      aria-label='선택한 표현 상세'>
      <AlertDialog {...confirmation.dialog} />
      <Card className={styles.pane}>
        <div className={styles.top}>
          <Badge tone='brand'>
            <Icon
              name='bookmark'
              size={14}
            />
            {expression.source.language === 'en' ? '영어' : '태국어'} · 내 표현
          </Badge>
          <Button
            type='button'
            variant='ghost'
            size='small'
            aria-expanded={editing}
            onClick={() => setEditing((value) => !value)}
            disabled={busy}>
            <Icon
              name='pencil'
              size={16}
            />
            {editing ? '편집 닫기' : '뜻 · 메모 편집'}
          </Button>
        </div>
        <div>
          <Heading
            level={2}
            className={styles.title}>
            {expression.text}
          </Heading>
          <Text
            as='p'
            display='block'
            color='secondary'
            className={styles.meta}>
            {kindNames[expression.kind]} ·{' '}
            {expression.reviewIncluded ? '복습에 포함' : '복습에서 잠시 제외'} ·
            원문 v{expression.source.version ?? 1}
            {expression.explanationVersion !== null
              ? ` · 저장 당시 AI 설명 v${expression.explanationVersion}`
              : ''}
          </Text>
        </div>
        <ExpressionReviewStatus expression={expression} />
        <Text
          as='p'
          display='block'
          className={
            expression.meaning
              ? styles.meaning
              : `${styles.meaning} ${styles.empty}`
          }>
          {expression.meaning || '아직 정리한 뜻이 없어요.'}
        </Text>
        <div className={styles.context}>
          <Text
            as='p'
            display='block'
            color='secondary'
            className={styles.caption}>
            처음 만난 문맥
          </Text>
          <Blockquote>“{expression.source.quote}”</Blockquote>
          <Link
            className={styles.sourceLink}
            href={materialPaths.source(expression.source)}>
            <Icon
              name={expression.source.kind === 'pdf' ? 'file-text' : 'play'}
              size={16}
            />
            {expression.source.title} · {sourceLabel(expression.source)} ↗
          </Link>
        </div>
        {editing ? (
          <form
            className={styles.tray}
            onSubmit={(event) => void save(event)}>
            <div
              role='group'
              aria-labelledby={kindLabelId}
              className={styles.kindField}>
              <span
                id={kindLabelId}
                className={styles.kindLabel}>
                저장 종류
              </span>
              <div className={styles.kindOptions}>
                {(Object.keys(kindNames) as (keyof typeof kindNames)[]).map(
                  (value) => (
                    <Button
                      key={value}
                      type='button'
                      variant='secondary'
                      size='small'
                      aria-pressed={kind === value}
                      onClick={() => setKind(value)}>
                      {kindNames[value]}
                    </Button>
                  )
                )}
              </div>
            </div>
            <Input
              label={contentLabel(<>내가 정리한 뜻</>)}
              maxLength={5000}
              value={meaning}
              onChange={(event) => setMeaning(event.target.value)}
            />
            <TextArea
              label={contentLabel(<>내 메모</>)}
              maxLength={5000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
            <Button
              variant='ink'
              className={styles.submit}
              disabled={busy}
              loading={busy}>
              변경 저장
            </Button>
          </form>
        ) : (
          <div className={`${styles.tray} ${styles.note}`}>
            <Text
              as='p'
              display='block'
              color='secondary'
              className={styles.caption}>
              내 메모 · 나만 보기
            </Text>
            <Text
              as='p'
              display='block'
              className={
                expression.note
                  ? styles.noteText
                  : `${styles.noteText} ${styles.empty}`
              }>
              {expression.note || '다시 떠올리고 싶은 문맥을 메모해 보세요.'}
            </Text>
          </div>
        )}
        {sessionExpired && <SessionRecovery />}
        {error && (
          <Banner
            status='error'
            title='확인이 필요해요'
            role='alert'>
            {error}
          </Banner>
        )}
        <div className={styles.actions}>
          <ButtonLink
            href={`/practice?expressionId=${encodeURIComponent(expression.id)}`}>
            <Icon
              name='repeat-2'
              size={16}
            />
            이 표현 복습하기
          </ButtonLink>
          <ButtonLink
            href={materialPaths.source(expression.source)}
            variant='secondary'>
            원문으로
          </ButtonLink>
          <Button
            type='button'
            variant='ghost'
            disabled={busy}
            onClick={() => {
              setBusy(true);

              void updateExpression(expression.id, {
                reviewIncluded: !expression.reviewIncluded,
              })
                .then(onChange)
                .catch((error) => setError(error.message))
                .finally(() => setBusy(false));
            }}>
            {expression.reviewIncluded
              ? '복습에서 잠시 제외'
              : '다시 복습에 포함'}
          </Button>
          <Button
            type='button'
            variant='ghost'
            className={styles.remove}
            startIcon='trash-2'
            disabled={busy}
            onClick={() => void remove()}>
            표현 삭제
          </Button>
        </div>
      </Card>
    </section>
  );
}
