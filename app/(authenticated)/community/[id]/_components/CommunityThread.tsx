'use client';
import { AlertDialog } from '@/components/ui/composites/AlertDialog';
import { useConfirmation } from '@/lib/hooks/useConfirmation';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Avatar } from '@/components/ui/primitives/Avatar';
import { Badge } from '@/components/ui/primitives/Badge';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Section } from '@/components/ui/layouts/Section';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../../_components/SessionRecovery';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/components/ui/primitives/Link';
import type {
  CommunityPost,
  CommunityPosts,
} from '@/domains/community/model/contracts';
import {
  getCommunityPost,
  addCommunityComment,
  deleteCommunityComment,
  deleteCommunityPost,
  reactToCommunityPost,
  followCommunityAuthor,
} from '@/domains/community/api/community';
import { materialPaths } from '@/domains/materials/config/paths';
import { sourceLabel } from '@/domains/learning/lib/format';
import { Button } from '@/components/ui/primitives/Button';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { IconButton } from '@/components/ui/primitives/IconButton';
import { RelativeTime } from '@/components/ui/primitives/RelativeTime';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Icon } from '@/components/ui/primitives/Icon';
import { CommunityPostComposer } from '../../../../_components/CommunityPostComposer';
import * as workspace from '@/lib/styles/workspace.css';
import { CommunityHelperAnsweredBadge } from '../../_components/CommunityHelperAnsweredBadge';
import { CommunityKindBadge } from '../../_components/CommunityKindBadge';
import { CommunityComment } from './CommunityComment';
import { CommunityExpressionCard } from './CommunityExpressionCard';
import { CommunityRelatedPosts } from './CommunityRelatedPosts';
import { CommunityReportDialog } from './CommunityReportDialog';
import * as styles from './CommunityThread.css';

/** 추천·팔로우와 작성자 관리를 공개된 글의 범위 안에서만 수행하고 같은 구절의 학습을 옆 열에 잇는다. */
export function CommunityThread({
  initial,
  related,
}: {
  initial: CommunityPost;
  related: CommunityPosts['items'];
}) {
  const confirmation = useConfirmation();
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [editing, setEditing] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const authorName = value.author.name ?? '학습자';

  // 조교 답변을 먼저 모아 보여 주되 각 묶음 안의 작성 순서는 유지한다.
  const comments = [
    ...value.comments.filter((comment) => comment.author.isHelper),
    ...value.comments.filter((comment) => !comment.author.isHelper),
  ];

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
      !(await confirmation.confirm(
        '이 일반 게시글과 댓글을 삭제할까요? 원본 자료와 개인 학습 기록은 유지됩니다.'
      ))
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

  const hasAside = related.length > 0 || value.expressionSource !== null;

  return (
    <div className={styles.layout}>
      <article className={styles.root}>
        <AlertDialog {...confirmation.dialog} />
        <ButtonLink
          href='/community'
          variant='ghost'
          className={styles.back}>
          <Icon
            name='chevron-left'
            size={18}
          />
          학습 커뮤니티
        </ButtonLink>
        <div className={styles.badges}>
          <CommunityKindBadge kind={value.kind} />
          <Badge tone='neutral'>
            {value.language === 'en' ? '영어' : '태국어'}
          </Badge>
          {/* 시안은 종류와 언어만 두므로 공개 범위는 지정 계정 글일 때만 알린다. */}
          {value.visibility === 'accounts' && (
            <Badge tone='info'>지정 계정에게 공개</Badge>
          )}
          {value.helperAnswered && <CommunityHelperAnsweredBadge />}
        </div>
        <Heading level={1}>{value.title}</Heading>
        <div className={styles.author}>
          <span
            aria-hidden='true'
            className={styles.avatar}>
            <Avatar
              name={authorName}
              size={40}
              tooltip={false}
            />
          </span>
          <div className={styles.authorInfo}>
            <p className={styles.authorName}>
              {authorName}
              {value.author.isHelper && (
                <Badge
                  tone='solid'
                  size='small'
                  shape='square'>
                  조교
                </Badge>
              )}
            </p>
            <p className={styles.authorMeta}>
              {value.author.isHelper ? '조교' : '학습자'} ·{' '}
              <RelativeTime value={value.createdAt} />
            </p>
          </div>
          {!value.owned && (
            <Button
              type='button'
              variant='secondary'
              size='small'
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
        </div>
        {value.source && (
          <figure className={styles.excerpt}>
            <figcaption className={styles.excerptCaption}>
              공유한 원문 발췌
              <span className={styles.excerptSource}>
                · {value.source.title} · {sourceLabel(value.source)}
              </span>
            </figcaption>
            <blockquote className={styles.excerptQuote}>
              {value.source.quote}
            </blockquote>
            <Link
              href={materialPaths.source(value.source)}
              className={styles.excerptLink}>
              접근 가능한 원문에서 보기
              <Icon
                name='arrow-up-right'
                size={14}
              />
            </Link>
            <p className={styles.excerptNote}>
              원본 전체 접근 권한은 별도로 확인합니다.
            </p>
          </figure>
        )}
        <p className={styles.body}>{value.body}</p>
        <div className={styles.actions}>
          {value.taggedHelpers.map((helper) => (
            <span
              key={helper.id}
              className={styles.tag}>
              @ {helper.name ?? '조교'}
              {helper.name && ' 조교'}
            </span>
          ))}
          <span className={styles.spacer} />
          <Button
            type='button'
            variant='secondary'
            startIcon='thumbs-up'
            hasPressedPop
            disabled={busy}
            aria-pressed={value.liked}
            onClick={() =>
              void change(() => reactToCommunityPost(value.id, !value.liked))
            }>
            추천 {value.likes}
          </Button>
          <IconButton
            label='게시글 신고'
            name='flag'
            size='medium'
            variant='outline'
            disabled={busy}
            onClick={() => setReporting(true)}
          />
          {value.owned && (
            <>
              <Button
                type='button'
                variant='ghost'
                disabled={busy}
                onClick={() => setEditing(true)}>
                글 수정
              </Button>
              <Button
                type='button'
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
          <Banner
            status='error'
            title='확인이 필요해요'
            role='alert'>
            {error}
          </Banner>
        )}
        {value.hiddenAt && (
          <Banner
            status='info'
            title='안내'>
            운영자가 숨김 처리한 글입니다. 작성자 외에는 글과 댓글을 볼 수
            없습니다.
          </Banner>
        )}
        {reported && (
          <Banner
            status='info'
            title='안내'
            role='status'>
            신고를 접수했습니다. 학습 자료의 정답·설명 오류 신고와 별도로
            검토합니다.
          </Banner>
        )}
        <CommunityReportDialog
          postId={value.id}
          open={reporting}
          onClose={() => setReporting(false)}
          onReported={() => {
            setReporting(false);
            setReported(true);
          }}
        />
        <Section
          variant='transparent'
          dividers={['top']}>
          <div className={styles.comments}>
            <Heading level={2}>댓글 {value.comments.length}</Heading>
            {comments.map((comment) => (
              <CommunityComment
                key={comment.id}
                comment={comment}
                canDelete={comment.owned || value.owned}
                busy={busy}
                onDelete={async () => {
                  if (await confirmation.confirm('이 댓글을 삭제할까요?'))
                    void change(() =>
                      deleteCommunityComment(value.id, comment.id)
                    );
                }}
              />
            ))}
            <form
              className={styles.composer}
              onSubmit={(event) => {
                event.preventDefault();

                void change(async () => {
                  await addCommunityComment(value.id, body.trim());
                  setBody('');
                });
              }}>
              <div className={workspace.field}>
                <TextArea
                  label={contentLabel(<>댓글</>)}
                  placeholder='답변이나 생각을 나눠 주세요'
                  required
                  maxLength={5000}
                  disabled={busy}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                />
              </div>
              <Button
                variant='ink'
                className={styles.submit}
                loading={busy}
                disabled={busy || !body.trim()}>
                등록
              </Button>
            </form>
          </div>
        </Section>
        {editing && (
          <CommunityPostComposer
            initial={value}
            onClose={() => {
              setEditing(false);
              void change(async () => {});
            }}
          />
        )}
      </article>
      {hasAside && (
        <aside
          aria-label='이 구절과 관련된 학습'
          className={styles.aside}>
          {value.expressionSource && (
            <CommunityExpressionCard source={value.expressionSource} />
          )}
          {related.length > 0 && <CommunityRelatedPosts items={related} />}
        </aside>
      )}
    </div>
  );
}
