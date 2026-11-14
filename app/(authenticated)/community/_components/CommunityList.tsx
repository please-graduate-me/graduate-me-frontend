'use client';
import { Banner } from '@astryxdesign/core/Banner';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useState } from 'react';
import type { CommunityPosts } from '@/domains/community/model/contracts';
import type { SourceInput } from '@/domains/materials/model/source';
import { listCommunityPosts } from '@/domains/community/api/community';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Icon } from '@/components/ui/primitives/Icon';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { CommunityPostComposer } from '../../../_components/CommunityPostComposer';
import { CommunityPostCard } from './CommunityPostCard';
import * as styles from './CommunityList.css';

const languageOptions = [
  { value: 'en', label: '영어' },
  { value: 'th', label: '태국어' },
] as const;

/** 언어별 일반 글 검색과 팔로우 목록을 비공개 질문함에서 분리한다. */
export function CommunityList({
  initial,
  source,
  initialLanguage,
  tagged = false,
}: {
  initial: CommunityPosts;
  tagged?: boolean;
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
      setValue(
        await listCommunityPosts({ language, q, following, page, tagged })
      );
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.root}>
      <aside
        className={styles.aside}
        aria-label='커뮤니티 보기'>
        <div
          role='group'
          aria-label='글 모아보기'
          className={styles.views}>
          <Button
            type='button'
            variant='ghost'
            className={styles.view}
            aria-pressed={!following}
            onClick={() => setFollowing(false)}>
            <Icon
              name='list'
              size={18}
            />
            전체 글
          </Button>
          <Button
            type='button'
            variant='ghost'
            className={styles.view}
            aria-pressed={following}
            onClick={() => setFollowing(true)}>
            <Icon
              name='users'
              size={18}
            />
            팔로우한 작성자
          </Button>
        </div>
        <section
          className={styles.languages}
          aria-labelledby='community-language'>
          <Text
            as='p'
            id='community-language'
            display='block'
            size='sm'
            weight='bold'
            color='secondary'>
            게시글 언어
          </Text>
          <div
            role='group'
            aria-labelledby='community-language'
            className={styles.languageOptions}>
            {languageOptions.map((option) => (
              <Button
                key={option.value}
                type='button'
                variant='secondary'
                size='small'
                aria-pressed={language === option.value}
                onClick={() => setLanguage(option.value)}>
                {option.label}
              </Button>
            ))}
          </div>
        </section>
      </aside>
      <div className={styles.main}>
        <div className={styles.intro}>
          <div>
            <Heading level={1}>
              {tagged ? '나를 태그한 글' : '학습 커뮤니티'}
            </Heading>
            <Text
              as='p'
              display='block'
              color='secondary'>
              학습 경험과 질문을 나누고, 조교를 태그해 함께 이야기해 보세요.
            </Text>
          </div>
          <Button
            type='button'
            variant='ink'
            onClick={() => setCompose(true)}>
            <Icon
              name='pencil'
              size={16}
            />
            글 쓰기
          </Button>
        </div>
        <form
          role='search'
          className={styles.search}
          onSubmit={(event) => {
            event.preventDefault();
            void load();
          }}>
          <Icon
            name='search'
            size={18}
          />
          <Input
            aria-label='게시글 검색'
            className={styles.searchInput}
            value={q}
            maxLength={100}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='제목과 내용 검색'
          />
          <Button loading={busy}>검색</Button>
        </form>
        {sessionExpired && <SessionRecovery />}
        {error && (
          <Banner
            status='error'
            title='확인이 필요해요'
            role='alert'>
            {error}
          </Banner>
        )}
        {!value.items.length ? (
          <EmptyState
            title='이 조건의 글이 없어요'
            description='다른 검색 조건을 선택하거나 첫 학습 경험을 나눠 보세요.'
            icon='message-circle'
          />
        ) : (
          <ul className={styles.list}>
            {value.items.map((item) => (
              <li key={item.id}>
                <CommunityPostCard item={item} />
              </li>
            ))}
          </ul>
        )}
        <div className={styles.pagination}>
          <Button
            type='button'
            variant='secondary'
            disabled={busy || value.page <= 1}
            onClick={() => void load(value.page - 1)}>
            이전
          </Button>
          <span>{value.page}페이지</span>
          <Button
            type='button'
            variant='secondary'
            disabled={busy || !value.hasMore}
            onClick={() => void load(value.page + 1)}>
            다음
          </Button>
        </div>
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
