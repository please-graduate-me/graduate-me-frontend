'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useState } from 'react';
import Link from 'next/link';
import type { CommunityPosts } from '@/domains/community/model/contracts';
import type { SourceInput } from '@/domains/materials/model/source';
import { listCommunityPosts } from '@/domains/community/api/community';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Select } from '@/components/ui/primitives/Select';
import { Checkbox } from '@/components/ui/primitives/Checkbox';
import { Badge } from '@/components/ui/primitives/Badge';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { formatDate } from '@/domains/learning/lib/format';
import { CommunityPostComposer } from './CommunityPostComposer';
import * as styles from '@/lib/styles/workspace.css';

/** 언어별 일반 글 검색과 팔로우 목록을 비공개 질문함에서 분리한다. */
export function CommunityList({
  initial,
  source,
  initialLanguage,
}: {
  initial: CommunityPosts;
  initialLanguage: 'en' | 'th';
  source?: SourceInput;
}) {
  const [value, setValue] = useState(initial);
  const [language, setLanguage] = useState<'en' | 'th'>(initialLanguage);
  const [q, setQuery] = useState('');
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [compose, setCompose] = useState(Boolean(source));

  async function load(page = 1) {
    setBusy(true);
    setError('');

    try {
      setValue(await listCommunityPosts({ language, q, following, page }));
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>학습 커뮤니티</h1>
          <p className={styles.description}>
            관심과 원문 경험을 나누는 일반 게시글입니다. 도우미 질문은 나의
            질문에서 관리합니다.
          </p>
        </div>
        <Button onClick={() => setCompose(true)}>글 쓰기</Button>
      </div>
      <form
        className={styles.filters}
        onSubmit={(event) => {
          event.preventDefault();
          void load();
        }}>
        <Input
          aria-label='게시글 검색'
          value={q}
          maxLength={100}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='제목과 내용 검색'
        />
        <Select
          aria-label='게시글 언어'
          value={language}
          onChange={(event) =>
            setLanguage(event.target.value as typeof language)
          }>
          <option value='en'>영어</option>
          <option value='th'>태국어</option>
        </Select>
        <label className={styles.row}>
          <Checkbox
            checked={following}
            onChange={(event) => setFollowing(event.target.checked)}
          />
          팔로우한 작성자
        </label>
        <Button loading={busy}>검색</Button>
      </form>
      {sessionExpired && <SessionRecovery />}
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
      {!value.items.length ? (
        <EmptyState
          title='이 조건의 글이 없어요'
          description='다른 검색 조건을 선택하거나 첫 학습 경험을 나눠 보세요.'
          icon='message-circle'
        />
      ) : (
        value.items.map((item) => (
          <article
            className={styles.message}
            key={item.id}>
            <h2>
              <Link href={`/community/${encodeURIComponent(item.id)}`}>
                {item.title}
              </Link>
            </h2>
            <p>
              {item.author.name ?? '학습자'} · {formatDate(item.createdAt)}
            </p>
            <p className={styles.prose}>{item.body.slice(0, 200)}</p>
            <div className={styles.row}>
              <Badge tone='neutral'>
                {item.visibility === 'public' ? '공개 글' : '지정 계정'}
              </Badge>
              <span>
                추천 {item.likes} · 댓글 {item.comments}
              </span>
            </div>
          </article>
        ))
      )}
      <div className={styles.row}>
        <Button
          variant='secondary'
          disabled={busy || value.page <= 1}
          onClick={() => void load(value.page - 1)}>
          이전
        </Button>
        <span>{value.page}페이지</span>
        <Button
          variant='secondary'
          disabled={busy || !value.hasMore}
          onClick={() => void load(value.page + 1)}>
          다음
        </Button>
      </div>
      {compose && (
        <CommunityPostComposer
          language={language}
          source={source}
          onClose={() => setCompose(false)}
        />
      )}
    </div>
  );
}
