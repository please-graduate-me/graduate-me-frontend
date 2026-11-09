'use client';
import { useState } from 'react';
import type { SourceInput } from '@/domains/materials/model/source';
import type { Annotation } from '@/domains/materials/model/records';
import { createAnnotation } from '@/domains/materials/api/records';
import { Button } from '@/components/ui/primitives/Button';
import { Select } from '@/components/ui/primitives/Select';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Dialog } from '@/components/ui/composites/Dialog';
import * as styles from '@/lib/styles/workspace.css';

/** 페이지 선택 영역과 개인 메모를 영구 저장한다. */
export function AnnotationComposer({
  source,
  onClose,
  onSaved,
}: {
  source: SourceInput;
  onClose: () => void;
  onSaved?: (value: Annotation) => void;
}) {
  const [color, setColor] = useState<'yellow' | 'blue' | 'green'>('yellow');
  const [memo, setMemo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const value = await createAnnotation({ source, color, memo });

      onSaved?.(value);
      onClose();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open
      onClose={() => {
        if (!busy) onClose();
      }}
      title='하이라이트와 개인 메모'
      description='선택한 원문 위치와 메모는 나에게만 보입니다.'>
      <form
        className={styles.stack}
        onSubmit={(event) => void save(event)}>
        <blockquote className={styles.quote}>{source.quote}</blockquote>
        <label className={styles.field}>
          하이라이트 색상
          <Select
            value={color}
            onChange={(event) => setColor(event.target.value as typeof color)}>
            <option value='yellow'>노랑</option>
            <option value='blue'>파랑</option>
            <option value='green'>초록</option>
          </Select>
        </label>
        <label className={styles.field}>
          이 구절의 메모
          <TextArea
            value={memo}
            maxLength={5000}
            onChange={(event) => setMemo(event.target.value)}
          />
        </label>
        {error && (
          <p
            className={styles.error}
            role='alert'>
            {error}
          </p>
        )}
        <div className={styles.row}>
          <Button
            type='button'
            variant='secondary'
            disabled={busy}
            onClick={onClose}>
            취소
          </Button>
          <Button
            loading={busy}
            disabled={busy}>
            위치와 함께 저장
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
