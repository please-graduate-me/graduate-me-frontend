'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SourceInput } from '@/domains/materials/model/source';
import { createExpression } from '@/domains/expressions/api/expressions';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Dialog } from '@/components/ui/composites/Dialog';
import { Select } from '@/components/ui/primitives/Select';
import type { Explanation } from '@/domains/ai/model/contracts';
import * as styles from '@/lib/styles/workspace.css';

/** 선택한 원문에 사용자가 적은 뜻과 메모를 더해 개인 표현집에 저장한다. */
export function ExpressionComposer({
  source,
  onClose,
  explanation,
}: {
  source: SourceInput;
  onClose: () => void;
  explanation?: Explanation;
}) {
  const router = useRouter();
  const [text, setText] = useState(source.quote.slice(0, 1000));

  const [meaning, setMeaning] = useState(
    explanation?.payload.meaning || explanation?.payload.translation || ''
  );

  const [kind, setKind] = useState<'word' | 'phrase' | 'sentence' | 'concept'>(
    'phrase'
  );

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
        kind,
        ...(explanation
          ? {
              explanationId: explanation.id,
              explanationVersion: explanation.version,
            }
          : {}),
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
          저장 종류
          <Select
            value={kind}
            onChange={(event) => setKind(event.target.value as typeof kind)}>
            <option value='word'>단어</option>
            <option value='phrase'>숙어·표현</option>
            <option value='sentence'>문장</option>
            <option value='concept'>개념</option>
          </Select>
        </label>
        <label className={styles.field}>
          표현
          <Input
            autoFocus
            required
            maxLength={1000}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          뜻
          <Input
            maxLength={5000}
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
          표현과 개인 메모는 나에게만 보입니다.{' '}
          {explanation
            ? `AI 설명 v${explanation.version}의 뜻과 연결해 저장합니다. 직접 편집한 뜻과 원래 설명은 구분됩니다.`
            : '직접 정리한 뜻으로 저장합니다.'}
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
