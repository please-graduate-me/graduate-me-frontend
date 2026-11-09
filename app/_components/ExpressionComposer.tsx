'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SourceInput } from '@/domains/materials/model/source';
import { createExpression } from '@/domains/expressions/api/expressions';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Dialog } from '@/components/ui/composites/Dialog';
import * as styles from '@/lib/styles/workspace.css';

/** 선택한 원문에 사용자가 적은 뜻과 메모를 더해 개인 표현집에 저장한다. */
export function ExpressionComposer({
  source,
  onClose,
}: {
  source: SourceInput;
  onClose: () => void;
}) {
  const router = useRouter();
  const [text, setText] = useState(source.quote.slice(0, 500));
  const [meaning, setMeaning] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      await createExpression({
        source,
        text: text.trim(),
        meaning: meaning.trim(),
        note: note.trim(),
      });

      router.refresh();
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
      title='개인 표현집에 저장'
      description='이 원문에서 발견한 표현과 나만의 뜻을 남겨 보세요.'>
      <form
        onSubmit={(event) => void submit(event)}
        className={styles.stack}>
        <blockquote className={styles.quote}>{source.quote}</blockquote>
        <label className={styles.field}>
          표현
          <Input
            autoFocus
            required
            maxLength={500}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          뜻
          <Input
            maxLength={2000}
            value={meaning}
            onChange={(event) => setMeaning(event.target.value)}
            placeholder='문맥에서 이해한 뜻을 적어 주세요.'
          />
        </label>
        <label className={styles.field}>
          내 메모
          <TextArea
            maxLength={5000}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder='다시 떠올리고 싶은 문맥을 남겨 주세요.'
          />
        </label>
        <p className={styles.meta}>
          표현과 메모는 나에게만 보입니다. AI가 만든 설명으로 저장되지 않습니다.
        </p>
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
            disabled={busy || !text.trim()}
            loading={busy}>
            표현 저장
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
