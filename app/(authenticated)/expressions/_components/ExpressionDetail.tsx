'use client';
import { useState } from 'react';
import Link from 'next/link';
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
import * as styles from '@/lib/styles/workspace.css';

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
  const [editing, setEditing] = useState(false);
  const [meaning, setMeaning] = useState(expression.meaning);
  const [note, setNote] = useState(expression.note);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      onChange(await updateExpression(expression.id, { meaning, note }));
      setEditing(false);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (
      !window.confirm(
        '이 표현을 개인 표현집에서 삭제할까요? 원본 자료와 기존 연습 기록은 유지됩니다.'
      )
    )
      return;
    setBusy(true);
    setError('');

    try {
      await deleteExpression(expression.id);
      onDelete();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className={styles.panel}
      aria-label='선택한 표현 상세'>
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
      <h2 className={styles.expressionTitle}>{expression.text}</h2>
      <p className={styles.prose}>
        {expression.meaning || '아직 정리한 뜻이 없어요.'}
      </p>
      <p className={styles.meta}>처음 만난 문맥</p>
      <blockquote className={styles.quote}>
        {expression.source.quote}
      </blockquote>
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
          <label className={styles.field}>
            내가 정리한 뜻
            <Input
              maxLength={5000}
              value={meaning}
              onChange={(event) => setMeaning(event.target.value)}
            />
          </label>
          <label className={styles.field}>
            내 메모
            <TextArea
              maxLength={5000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
          <Button
            disabled={busy}
            loading={busy}>
            변경 저장
          </Button>
        </form>
      ) : (
        <>
          <p className={styles.meta}>내 메모 · 나만 보기</p>
          <p className={styles.prose}>
            {expression.note || '다시 떠올리고 싶은 문맥을 메모해 보세요.'}
          </p>
        </>
      )}
      {error && (
        <p
          role='alert'
          className={styles.error}>
          {error}
        </p>
      )}
      <div className={styles.row}>
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
    </section>
  );
}
