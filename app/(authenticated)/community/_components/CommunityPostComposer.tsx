'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveCommunityPost } from '@/domains/community/api/community';
import type { CommunityPost } from '@/domains/community/model/contracts';
import type { SourceInput } from '@/domains/materials/model/source';
import { Dialog } from '@/components/ui/composites/Dialog';
import { Input } from '@/components/ui/primitives/Input';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Select } from '@/components/ui/primitives/Select';
import { Checkbox } from '@/components/ui/primitives/Checkbox';
import { Button } from '@/components/ui/primitives/Button';
import * as styles from '@/lib/styles/workspace.css';

/** 일반 글의 공개 대상과 선택 발췌를 전송 전에 직접 확인한다. */
export function CommunityPostComposer({
  onClose,
  language = 'en',
  source,
  initial,
}: {
  onClose: () => void;
  language?: 'en' | 'th';
  source?: SourceInput;
  initial?: CommunityPost;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');

  const [selectedLanguage, setLanguage] = useState(
    initial?.language ?? language
  );

  const [visibility, setVisibility] = useState<'public' | 'accounts'>(
    initial?.visibility ?? 'public'
  );

  const [accounts, setAccounts] = useState(
    initial?.allowedUserIds?.join('\n') ?? ''
  );

  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const excerpt = source ?? initial?.source ?? undefined;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    // 이전 공개 확인을 입력 변경 뒤 재사용하지 않으며 원본 권한은 서버가 다시 확인한다.
    if (!confirmed || busy) return;
    setBusy(true);
    setError('');

    try {
      const result = await saveCommunityPost(
        {
          title: title.trim(),
          body: body.trim(),
          language: selectedLanguage,
          visibility,
          allowedUserIds:
            visibility === 'accounts'
              ? accounts.split(/[\s,]+/).filter(Boolean)
              : [],
          source: excerpt,
        },
        initial?.id
      );

      router.push(`/community/${encodeURIComponent(result.id)}`);
      router.refresh();
      onClose();
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
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
      title={initial ? '게시글 수정' : '일반 학습 글 쓰기'}
      description='도우미에게 보내는 비공개 질문과 다른 공간입니다.'>
      <form
        className={styles.stack}
        onSubmit={(event) => void submit(event)}>
        <label className={styles.field}>
          제목
          <Input
            required
            maxLength={200}
            value={title}
            disabled={busy}
            onChange={(event) => {
              setTitle(event.target.value);
              setConfirmed(false);
            }}
          />
        </label>
        <label className={styles.field}>
          내용
          <TextArea
            required
            maxLength={10000}
            value={body}
            disabled={busy}
            onChange={(event) => {
              setBody(event.target.value);
              setConfirmed(false);
            }}
          />
        </label>
        <label className={styles.field}>
          학습 언어
          <Select
            value={selectedLanguage}
            disabled={busy}
            onChange={(event) =>
              setLanguage(event.target.value as typeof selectedLanguage)
            }>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
        </label>
        <label className={styles.field}>
          공개 대상
          <Select
            value={visibility}
            disabled={busy}
            onChange={(event) => {
              setVisibility(event.target.value as typeof visibility);
              setConfirmed(false);
            }}>
            <option value='public'>서비스 이용자에게 공개</option>
            <option value='accounts'>지정 계정만</option>
          </Select>
        </label>
        {visibility === 'accounts' && (
          <label className={styles.field}>
            허용할 계정 식별자
            <TextArea
              required
              placeholder='공유받은 계정 식별자를 공백 또는 줄바꿈으로 구분하세요.'
              value={accounts}
              disabled={busy}
              onChange={(event) => {
                setAccounts(event.target.value);
                setConfirmed(false);
              }}
            />
          </label>
        )}
        {excerpt && (
          <div className={styles.preview}>
            <h3>함께 공유할 발췌</h3>
            <blockquote className={styles.quote}>{excerpt.quote}</blockquote>
            <p className={styles.meta}>
              {excerpt.kind === 'pdf'
                ? `PDF ${excerpt.page}페이지`
                : '영상 구절'}{' '}
              · 원문 v{excerpt.version ?? 1}
            </p>
          </div>
        )}
        <p className={styles.notice}>
          위 제목·본문{excerpt ? '·선택 발췌' : ''}가{' '}
          {visibility === 'public' ? '서비스 이용자' : '지정 계정'}에게
          공개됩니다. 개인 메모·전체 자료·답안·비공개 AI 대화는 공유하지
          않습니다.
        </p>
        <label className={styles.row}>
          <Checkbox
            checked={confirmed}
            disabled={busy}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          공개할 내용과 대상을 확인했어요.
        </label>
        {sessionExpired && <SessionRecovery />}
        {error && (
          <p
            className={styles.error}
            role='alert'>
            {error}
          </p>
        )}
        <Button
          loading={busy}
          disabled={!confirmed || busy}>
          게시하기
        </Button>
      </form>
    </Dialog>
  );
}
