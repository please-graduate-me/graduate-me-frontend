'use client';
import { useState } from 'react';
import type { SourceInput } from '@/domains/materials/model/source';
import { createQuestion } from '@/domains/questions/api/questions';
import { Dialog } from '@/components/ui/composites/Dialog';
import { Input } from '@/components/ui/primitives/Input';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Button } from '@/components/ui/primitives/Button';
import * as styles from '@/lib/styles/workspace.css';

/** 자료 오류 신고는 커뮤니티에 공개하지 않고 운영 검토로 전달한다. */
export function MaterialReportComposer({
  source,
  onClose,
  attachment,
}: {
  source: SourceInput;
  onClose: () => void;
  attachment?:
    | { artifactId: string; version: number }
    | { conversationId: string; messageId: string };
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return (
    <Dialog
      open
      onClose={onClose}
      title='자료 오류 신고'
      description='입력한 내용과 선택 원문을 운영자에게 전달합니다.'>
      <form
        className={styles.stack}
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy) return;
          setBusy(true);
          setError('');

          try {
            await createQuestion({
              title,
              body,
              source,
              kind: 'report',
              attachment,
            });

            onClose();
          } catch (error) {
            setError((error as Error).message);
          } finally {
            setBusy(false);
          }
        }}>
        <label className={styles.field}>
          제목
          <Input
            required
            maxLength={200}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          신고 내용
          <TextArea
            required
            maxLength={10000}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </label>
        <blockquote className={styles.quote}>{source.quote}</blockquote>
        {error && (
          <p
            role='alert'
            className={styles.error}>
            {error}
          </p>
        )}
        <Button loading={busy}>운영자에게 신고</Button>
      </form>
    </Dialog>
  );
}
