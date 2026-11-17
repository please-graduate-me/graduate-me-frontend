import { useRefreshData } from './useRefreshData';
import { Blockquote } from '@/components/ui/primitives/Blockquote';

import { Banner } from '@/components/ui/composites/Banner';

import { Text } from '@/components/ui/primitives/Text';
import { Heading } from '@/components/ui/primitives/Heading';

import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from './SessionRecovery';
import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import {
  listCommunityHelpers,
  saveCommunityPost,
} from '@/domains/community/api/community';
import type {
  CommunityPost,
  CommunityPostKind,
} from '@/domains/community/model/contracts';
import { communityPostKinds } from '@/domains/community/config/kinds';
import type { SourceInput } from '@/domains/materials/model/source';
import { Dialog } from '@/components/ui/composites/Dialog';
import { Input } from '@/components/ui/primitives/Input';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Select } from '@/components/ui/primitives/Select';
import { Checkbox } from '@/components/ui/primitives/Checkbox';
import { RadioList } from '@/components/ui/primitives/RadioList';
import { RadioListItem } from '@/components/ui/primitives/RadioListItem';
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
  beforeNavigate?: () => boolean | Promise<boolean>;
}) {
  const router = useRouter();
  const refreshData = useRefreshData();
  // 새 글은 서버가 종류를 필수로 받아 기본값 없이 직접 고르게 하고 수정은 기존 종류에서 시작한다.
  const [kind, setKind] = useState<CommunityPostKind | ''>(initial?.kind ?? '');

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
    if (!confirmed || busy) return;

    if (!kind) {
      setError('글 종류를 골라 주세요.');

      return;
    }

    setBusy(true);
    setError('');

    try {
      if (beforeNavigate && !(await beforeNavigate())) return;

      const input = {
        kind,
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
      };

      const result = initial
        ? await saveCommunityPost(input, initial.id)
        : await saveCommunityPost(input);

      void router.navigate({
        href: `/community/${encodeURIComponent(result.id)}`,
      });

      void refreshData();
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
        <RadioList
          label='글 종류'
          variant='tile'
          value={kind}
          isDisabled={busy}
          onChange={(value) => {
            setKind(value as CommunityPostKind);
            setError('');
          }}>
          {communityPostKinds.map((option) => (
            <RadioListItem
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </RadioList>
        <div className={styles.field}>
          <Input
            label='제목'

            required
            maxLength={200}
            value={title}
            disabled={busy}
            onChange={(event) => {
              setTitle(event.target.value);
              setConfirmed(false);
            }}
          />
        </div>
        <div className={styles.field}>
          <TextArea
            label='내용'

            required
            maxLength={10000}
            value={body}
            disabled={busy}
            onChange={(event) => {
              setBody(event.target.value);
              setConfirmed(false);
            }}
          />
        </div>
        <div className={styles.field}>
          <Select
            label='학습 언어'

            value={selectedLanguage}
            disabled={busy}
            onChange={(event) => {
              setLanguage(event.target.value as typeof selectedLanguage);
              setConfirmed(false);
            }}>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
        </div>
        <div className={styles.field}>
          <Select
            label='공개 대상'

            value={visibility}
            disabled={busy}
            onChange={(event) => {
              setVisibility(event.target.value as typeof visibility);
              setConfirmed(false);
            }}>
            <option value='public'>서비스 이용자에게 공개</option>
            <option value='accounts'>지정 계정만</option>
          </Select>
        </div>
        {visibility === 'accounts' && (
          <div className={styles.field}>
            <TextArea
              label='허용할 계정 식별자'

              required
              placeholder='공유받은 계정 식별자를 공백 또는 줄바꿈으로 구분하세요.'
              value={accounts}
              disabled={busy}
              onChange={(event) => {
                setAccounts(event.target.value);
                setConfirmed(false);
              }}
            />
          </div>
        )}
        <fieldset
          className={styles.stack}
          disabled={busy}>
          <legend>조교 태그</legend>
          {!helpers.length && (
            <Text as='p'>현재 태그할 수 있는 조교가 없습니다.</Text>
          )}
          {helpers.map((helper) => (
            <Checkbox
              key={helper.id}
              label={helper.name ?? '조교'}
              disabled={busy}
              checked={tagged.includes(helper.id)}
              onChange={(event) => {
                setTagged((previous) =>
                  event.target.checked
                    ? [...previous, helper.id]
                    : previous.filter((id) => id !== helper.id)
                );

                setConfirmed(false);
              }}
            />
          ))}
        </fieldset>
        {excerpt && (
          <div className={styles.preview}>
            <Heading level={3}>함께 공유할 발췌</Heading>
            <Blockquote className={styles.quote}>{excerpt.quote}</Blockquote>
            <Text
              as='p'
              className={styles.meta}>
              {excerpt.kind === 'pdf'
                ? `PDF ${excerpt.page}페이지`
                : '영상 구절'}{' '}
              · 원문 v{excerpt.version ?? 1}
            </Text>
          </div>
        )}
        <Banner
          status='warning'
          title={
            <>
              위 제목·본문{excerpt ? '·선택 발췌' : ''}가{' '}
              {visibility === 'public' ? '서비스 이용자' : '지정 계정'}에게
              공개됩니다. 개인 메모·전체 자료·답안·비공개 AI 대화는 공유하지
              않습니다.
            </>
          }
        />
        <Checkbox
          label={'공개할 내용과 대상을 확인했어요.'}
          checked={confirmed}
          disabled={busy}
          onChange={(event) => setConfirmed(event.target.checked)}
        />
        {sessionExpired && <SessionRecovery />}
        {error && (
          <Banner
            status='error'
            role='alert'
            title={<>{error}</>}
          />
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
