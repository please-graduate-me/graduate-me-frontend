'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SourceInput } from '@/domains/materials/model/source';
import {
  createQuestion,
  listRecipients,
} from '@/domains/questions/api/questions';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Select } from '@/components/ui/primitives/Select';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Dialog } from '@/components/ui/composites/Dialog';
import { Badge } from '@/components/ui/primitives/Badge';
import * as styles from '@/lib/styles/workspace.css';

/** 발췌와 실제 수신자를 재확인한 뒤에만 비공개 질문을 전송한다. */
export function QuestionComposer({
  source,
  language,
  onClose,
  attachment,
  attachmentText,
  report = false,
}: {
  source: SourceInput;
  language: 'en' | 'th';
  onClose: () => void;
  attachment?:
    | { artifactId: string; version: number }
    | { conversationId: string; messageId: string };
  attachmentText?: string;
  report?: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const [recipients, setRecipients] = useState<
    Awaited<ReturnType<typeof listRecipients>>['items']
  >([]);

  const [preview, setPreview] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [recipientError, setRecipientError] = useState('');
  const materialId = source.kind === 'pdf' ? source.materialId : source.videoId;

  useEffect(() => {
    let active = true;

    void listRecipients(language, materialId)
      .then((result) => {
        if (active) setRecipients(result.items);
      })
      .catch((error) => {
        if (active) setRecipientError(error.message);
      });

    return () => {
      active = false;
    };
  }, [language, materialId]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!preview) return setPreview(true);
    if (!confirmed) return;
    setBusy(true);
    setError('');

    try {
      const result = await createQuestion({
        title: title.trim(),
        body: body.trim(),
        source,
        ...(assigneeId ? { assigneeId } : {}),
        ...(attachment ? { attachment } : {}),
        kind: report ? 'report' : 'question',
      });

      router.push(`/questions/${encodeURIComponent(result.id)}`);
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
      title={preview ? '이 내용만 공유합니다' : '선택한 원문을 도우미에게 질문'}
      description='전체 자료와 개인 메모는 공개되지 않습니다.'>
      <form
        onSubmit={(event) => void submit(event)}
        className={styles.stack}>
        <div className={styles.preview}>
          <Badge tone='brand'>
            {source.kind === 'pdf'
              ? `PDF · ${source.page}페이지`
              : '선택한 영상 구절'}
          </Badge>
          <blockquote className={styles.quote}>{source.quote}</blockquote>
        </div>
        {!preview ? (
          <>
            <label className={styles.field}>
              질문 제목
              <Input
                autoFocus
                required
                maxLength={200}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder='무엇이 궁금한가요?'
              />
            </label>
            <label className={styles.field}>
              궁금한 내용
              <TextArea
                required
                maxLength={5000}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder='이 구절에서 궁금한 점을 구체적으로 적어 주세요.'
              />
            </label>
            <label className={styles.field}>
              받는 사람
              <Select
                value={assigneeId}
                onChange={(event) => setAssigneeId(event.target.value)}>
                <option value=''>운영자 접수 · 도우미 배정 대기</option>
                {recipients.map((person) => (
                  <option
                    key={person.id}
                    value={person.id}>
                    {person.name ?? '학과 도우미'} ·{' '}
                    {language === 'en' ? '영어' : '태국어'}
                  </option>
                ))}
              </Select>
            </label>
            {recipientError && (
              <p className={styles.meta}>
                도우미 목록을 불러오지 못했습니다. 운영자에게 접수할 수
                있습니다. {recipientError}
              </p>
            )}
          </>
        ) : (
          <>
            <h3>{title}</h3>
            <p className={styles.prose}>{body}</p>
            <p className={styles.notice}>
              공개 대상:{' '}
              {recipients.find((person) => person.id === assigneeId)?.name ??
                '질문을 배정할 운영자'}
              <br />
              공개 내용: 위 발췌와 질문 제목·내용
              {attachmentText ? ', 아래에서 확인한 AI 결과' : ''}
              <br />
              공개되지 않는 내용: 전체 비공개 자료, 내 메모, 답안과 학습 기록
            </p>
            <label className={styles.row}>
              <input
                type='checkbox'
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              공개할 발췌와 받는 사람을 확인했어요.
            </label>
          </>
        )}
        {attachmentText && (
          <div className={styles.preview}>
            <h3>함께 공유할 선택 결과</h3>
            <p className={styles.prose}>{attachmentText}</p>
            <p className={styles.meta}>전체 비공개 대화는 공유되지 않습니다.</p>
          </div>
        )}
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
            onClick={() => (preview ? setPreview(false) : onClose())}>
            {preview ? '질문 수정' : '취소'}
          </Button>
          <Button
            loading={busy}
            disabled={
              busy || !title.trim() || !body.trim() || (preview && !confirmed)
            }>
            {preview ? '질문 보내기' : '공유 범위 확인'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
