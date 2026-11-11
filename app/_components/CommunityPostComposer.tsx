'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from './SessionRecovery';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  listCommunityHelpers,
  saveCommunityPost,
} from '@/domains/community/api/community';
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
  initialBody = '',
  beforeNavigate,
}: {
  onClose: () => void;
  language?: 'en' | 'th';
  source?: SourceInput;
  initial?: CommunityPost;
  initialBody?: string;
  beforeNavigate?: () => boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? initialBody);

  const [selectedLanguage, setLanguage] = useState(
    initial?.language ?? language
  );

  const [visibility, setVisibility] = useState<'public' | 'accounts'>(
    initial?.visibility ?? 'public'
  );

  const [accounts, setAccounts] = useState(
    initial?.allowedUserIds?.join('\n') ?? ''
  );

  const [helpers, setHelpers] = useState<{ id: string; name: string | null }[]>(
    []
  );

  const [tagged, setTagged] = useState<string[]>(
    initial?.taggedHelpers.map((helper) => helper.id) ?? []
  );

  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    let active = true;

    void listCommunityHelpers()
      .then((result) => {
        if (active) setHelpers(result.items);
      })
      .catch((error) => {
        if (active) setError(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  const excerpt = source ?? initial?.source ?? undefined;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    // 이전 공개 확인을 입력 변경 뒤 재사용하지 않으며 원본 권한은 서버가 다시 확인한다.
    if (!confirmed || busy || (beforeNavigate && !beforeNavigate())) return;
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
          taggedHelperIds: tagged,
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
      description='조교를 태그하면 해당 조교의 모아보기에도 표시됩니다. 답변은 이 게시글의 댓글에서 나눕니다.'>
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
            onChange={(event) => {
              setLanguage(event.target.value as typeof selectedLanguage);
              setConfirmed(false);
            }}>
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
        <fieldset
          className={styles.stack}
          disabled={busy}>
          <legend>조교 태그</legend>
          {!helpers.length && <p>현재 태그할 수 있는 조교가 없습니다.</p>}
          {helpers.map((helper) => (
            <label
              key={helper.id}
              className={styles.row}>
              <Checkbox
                checked={tagged.includes(helper.id)}
                onChange={(event) => {
                  setTagged((previous) =>
                    event.target.checked
                      ? [...previous, helper.id]
                      : previous.filter((id) => id !== helper.id)
                  );

                  setConfirmed(false);
                }}
              />{' '}
              {helper.name ?? '조교'}
            </label>
          ))}
        </fieldset>
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
