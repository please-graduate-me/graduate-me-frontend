'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from './SessionRecovery';
import { useState } from 'react';
import type { Annotation } from '@/domains/materials/model/records';
import {
  deleteAnnotation,
  updateAnnotation,
} from '@/domains/materials/api/records';
import { Button } from '@/components/ui/primitives/Button';
import { TextArea } from '@/components/ui/primitives/TextArea';
import * as styles from '@/lib/styles/workspace.css';

/** 저장된 위치별 메모를 편집하거나 강조 표시만 삭제한다. */
export function AnnotationList({
  items,
  onChange,
  onDelete,
}: {
  items: Annotation[];
  onChange: (value: Annotation) => void;
  onDelete: (id: string) => void;
}) {
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [busy, setBusy] = useState(false);

  async function save(item: Annotation, memo: string) {
    if (memo === item.memo) return;
    setBusy(true);
    setError('');

    try {
      onChange(await updateAnnotation(item.id, { memo }));
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    setError('');

    try {
      await deleteAnnotation(id);
      onDelete(id);
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <details>
      <summary>저장한 하이라이트·메모 {items.length}개</summary>
      {items.map((item) => (
        <article
          key={item.id}
          className={styles.stack}>
          <blockquote className={styles.quote}>{item.source.quote}</blockquote>
          <TextArea
            aria-label='구절 개인 메모'
            disabled={busy}
            defaultValue={item.memo}
            maxLength={5000}
            onBlur={(event) => void save(item, event.target.value)}
          />
          <Button
            size='small'
            variant='danger'
            disabled={busy}
            onClick={() => void remove(item.id)}>
            하이라이트 삭제
          </Button>
        </article>
      ))}
      {sessionExpired && <SessionRecovery />}
      {error && (
        <p
          role='alert'
          className={styles.error}>
          {error}
        </p>
      )}
    </details>
  );
}
