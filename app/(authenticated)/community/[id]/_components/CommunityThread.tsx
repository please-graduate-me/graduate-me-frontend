'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../../_components/SessionRecovery';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CommunityPost } from '@/domains/community/model/contracts';
import {
  getCommunityPost,
  reportCommunityPost,
  addCommunityComment,
  deleteCommunityComment,
  deleteCommunityPost,
  reactToCommunityPost,
  followCommunityAuthor,
} from '@/domains/community/api/community';
import { materialPaths } from '@/domains/materials/config/paths';
import { formatDate } from '@/domains/learning/lib/format';
import { Button } from '@/components/ui/primitives/Button';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { CommunityPostComposer } from '../../_components/CommunityPostComposer';
import * as styles from '@/lib/styles/workspace.css';

/** 추천·팔로우와 작성자 관리를 공개된 글의 범위 안에서만 수행한다. */
export function CommunityThread({ initial }: { initial: CommunityPost }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [editing, setEditing] = useState(false);
  const [reason, setReason] = useState('');
  const [reported, setReported] = useState(false);

  async function change(operation: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    setError('');

    try {
      await operation();
      setValue(await getCommunityPost(value.id));
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (
      !window.confirm(
        '이 일반 게시글과 댓글을 삭제할까요? 원본 자료와 개인 학습 기록은 유지됩니다.'
      )
    )
      return;
    setBusy(true);

    try {
      await deleteCommunityPost(value.id);
      router.push('/community');
      router.refresh();
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <ButtonLink
        href='/community'
        variant='ghost'>
        ← 학습 커뮤니티
      </ButtonLink>
      <h1>{value.title}</h1>
      <p className={styles.meta}>
        {value.author.name ?? '학습자'} · {formatDate(value.createdAt)} ·{' '}
        {value.visibility === 'public' ? '공개 글' : '지정 계정에게 공개'}
      </p>
      <p className={styles.prose}>{value.body}</p>
      {value.source && (
        <section className={styles.preview}>
          <h2>공유한 원문 발췌</h2>
          <blockquote className={styles.quote}>{value.source.quote}</blockquote>
          <Link
            href={materialPaths.source(value.source)}
            className={styles.link}>
            접근 가능한 원문에서 보기 ↗
          </Link>
          <p className={styles.meta}>
            원본 전체 접근 권한은 별도로 확인합니다.
          </p>
        </section>
      )}
      <div className={styles.row}>
        <Button
          variant='secondary'
          disabled={busy}
          aria-pressed={value.liked}
          onClick={() =>
            void change(() => reactToCommunityPost(value.id, !value.liked))
          }>
          {value.liked ? '추천 취소' : '추천'} · {value.likes}
        </Button>
        {!value.owned && (
          <Button
            variant='secondary'
            disabled={busy}
            aria-pressed={value.following}
            onClick={() =>
              void change(() =>
                followCommunityAuthor(value.author.id, !value.following)
              )
            }>
            {value.following ? '작성자 팔로우 해제' : '작성자 팔로우'}
          </Button>
        )}
        {value.owned && (
          <>
            <Button
              variant='ghost'
              disabled={busy}
              onClick={() => setEditing(true)}>
              글 수정
            </Button>
            <Button
              variant='danger'
              disabled={busy}
              onClick={() => void remove()}>
              글 삭제
            </Button>
          </>
        )}
      </div>
      {sessionExpired && <SessionRecovery />}
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
      {value.hiddenAt && (
        <p className={styles.notice}>
          운영자가 숨김 처리한 글입니다. 작성자 외에는 글과 댓글을 볼 수
          없습니다.
        </p>
      )}
      <details>
        <summary>일반 게시글 신고</summary>
        <form
          className={styles.stack}
          onSubmit={(event) => {
            event.preventDefault();

            void change(async () => {
              await reportCommunityPost(value.id, reason.trim());
              setReported(true);
              setReason('');
            });
          }}>
          <label className={styles.field}>
            신고 사유
            <TextArea
              value={reason}
              maxLength={5000}
              required
              disabled={busy}
              onChange={(event) => setReason(event.target.value)}
            />
          </label>
          <Button
            variant='secondary'
            disabled={busy || !reason.trim()}>
            운영자에게 신고
          </Button>
          {reported && (
            <p
              className={styles.notice}
              role='status'>
              신고를 접수했습니다. 학습 자료의 정답·설명 오류 신고와 별도로
              검토합니다.
            </p>
          )}
        </form>
      </details>
      <section>
        <h2>댓글 {value.comments.length}개</h2>
        {value.comments.map((comment) => (
          <article
            key={comment.id}
            className={styles.message}>
            <p className={styles.meta}>
              {comment.author.name ?? '학습자'} ·{' '}
              {formatDate(comment.createdAt)}
            </p>
            <p className={styles.prose}>{comment.body}</p>
            {(comment.owned || value.owned) && (
              <Button
                variant='ghost'
                size='small'
                disabled={busy}
                onClick={() => {
                  if (window.confirm('이 댓글을 삭제할까요?'))
                    void change(() =>
                      deleteCommunityComment(value.id, comment.id)
                    );
                }}>
                댓글 삭제
              </Button>
            )}
          </article>
        ))}
        <form
          className={styles.stack}
          onSubmit={(event) => {
            event.preventDefault();

            void change(async () => {
              await addCommunityComment(value.id, body.trim());
              setBody('');
            });
          }}>
          <label className={styles.field}>
            댓글
            <TextArea
              required
              maxLength={5000}
              disabled={busy}
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </label>
          <Button
            loading={busy}
            disabled={busy || !body.trim()}>
            댓글 게시
          </Button>
        </form>
      </section>
      {editing && (
        <CommunityPostComposer
          initial={value}
          onClose={() => {
            setEditing(false);
            void change(async () => {});
          }}
        />
      )}
    </div>
  );
}
