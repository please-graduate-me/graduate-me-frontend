'use client';
import { AlertDialog } from '@astryxdesign/core/AlertDialog';
import { useConfirmation } from '@/lib/hooks/useConfirmation';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Banner } from '@astryxdesign/core/Banner';
import { Section } from '@astryxdesign/core/Section';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useState } from 'react';
import { Link } from '@astryxdesign/core/Link';
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
import { Select } from '@/components/ui/primitives/Select';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from '@/lib/styles/workspace.css';
import * as expressionStyles from './ExpressionDetail.css';

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
        '이 표현을 개인 표현집에서 삭제할까요? 원본 자료와 기존 연습 기록은 유지됩니다.'
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
    <Section
      className={expressionStyles.detail}
      aria-label='선택한 표현 상세'>
      <AlertDialog {...confirmation.dialog} />
      <div className={styles.row}>
        <Badge tone='brand'>
          <Icon
            name='bookmark'
            size={16}
          />
          {expression.source.language === 'en' ? '영어' : '태국어'} · 내 표현
        </Badge>
        <Button
          variant='ghost'
          size='small'
          onClick={() => setEditing((value) => !value)}
          disabled={busy}>
          <Icon
            name='pencil'
            size={16}
          />
          {editing ? '편집 닫기' : '뜻 · 메모 편집'}
        </Button>
      </div>
      <Heading
        level={2}
        className={expressionStyles.title}>
        {expression.text}
      </Heading>
      <Text
        as='p'
        display='block'
        className={styles.meta}>
        {
          {
            word: '단어',
            phrase: '숙어·표현',
            sentence: '문장',
            concept: '개념',
          }[expression.kind]
        }{' '}
        · {expression.reviewIncluded ? '복습에 포함' : '복습에서 잠시 제외'} ·
        원문 v{expression.source.version ?? 1}
        {expression.explanationVersion !== null
          ? ` · 저장 당시 AI 설명 v${expression.explanationVersion}`
          : ''}
      </Text>
      <Text
        as='p'
        display='block'
        className={styles.prose}>
        {expression.meaning || '아직 정리한 뜻이 없어요.'}
      </Text>
      <Text
        as='p'
        display='block'
        className={styles.meta}>
        처음 만난 문맥
      </Text>
      <Blockquote className={styles.quote}>
        {expression.source.quote}
      </Blockquote>
      <Link
        className={styles.link}
        href={materialPaths.source(expression.source)}>
        <Icon
          name={expression.source.kind === 'pdf' ? 'file-text' : 'play'}
          size={16}
        />
        {expression.source.title} · {sourceLabel(expression.source)} ↗
      </Link>
      {editing ? (
        <form
          className={styles.stack}
          onSubmit={(event) => void save(event)}>
          <div className={styles.field}>
            <Select
              label={contentLabel(<>저장 종류</>)}
              value={kind}
              onChange={(event) => setKind(event.target.value as typeof kind)}>
              <option value='word'>단어</option>
              <option value='phrase'>숙어·표현</option>
              <option value='sentence'>문장</option>
              <option value='concept'>개념</option>
            </Select>
          </div>
          <div className={styles.field}>
            <Input
              label={contentLabel(<>내가 정리한 뜻</>)}
              maxLength={5000}
              value={meaning}
              onChange={(event) => setMeaning(event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <TextArea
              label={contentLabel(<>내 메모</>)}
              maxLength={5000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
          <Button
            disabled={busy}
            loading={busy}>
            변경 저장
          </Button>
        </form>
      ) : (
        <>
          <Text
            as='p'
            display='block'
            className={styles.meta}>
            내 메모 · 나만 보기
          </Text>
          <Text
            as='p'
            display='block'
            className={styles.prose}>
            {expression.note || '다시 떠올리고 싶은 문맥을 메모해 보세요.'}
          </Text>
        </>
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
      <div className={styles.row}>
        <Button
          variant='ghost'
          size='small'
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
        <ButtonLink
          className={styles.link}
          href={`/practice?expressionId=${encodeURIComponent(expression.id)}`}>
          이 표현 복습하기
        </ButtonLink>
        <ButtonLink
          className={styles.link}
          href={materialPaths.source(expression.source)}
          variant='secondary'>
          원문으로
        </ButtonLink>
        <Button
          variant='danger'
          size='small'
          disabled={busy}
          onClick={() => void remove()}>
          표현 삭제
        </Button>
      </div>
    </Section>
  );
}
