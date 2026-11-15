'use client';
import { Banner } from '@/components/ui/composites/Banner';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { Pagination } from '@/components/ui/composites/Pagination';
import { SearchField } from '@/components/ui/composites/SearchField';
import { SideNavItem } from '@/components/ui/layouts/SideNavItem';
import { Button } from '@/components/ui/primitives/Button';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { ApiError } from '@/lib/api/request';
import { useRef, useState } from 'react';
import type {
  CommunityPostKind,
  CommunityPosts,
} from '@/domains/community/model/contracts';
import { communityPostKinds } from '@/domains/community/config/kinds';
import type { SourceInput } from '@/domains/materials/model/source';
import { listCommunityPosts } from '@/domains/community/api/community';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { CommunityPostComposer } from '../../../_components/CommunityPostComposer';
import { TaggedCountBadge } from '../../_components/TaggedCountBadge';
import { useTaggedCount } from '../../_components/taggedCountContext';
import { CommunityPostCard } from './CommunityPostCard';
import * as styles from './CommunityList.css';

const languageOptions = [
  { value: 'en', label: '영어' },
  { value: 'th', label: '태국어' },
] as const;

const kindOptions = [
  { value: undefined, label: '전체' },
  ...communityPostKinds,
] as const;

type View = 'all' | 'following' | 'helpers';

type Filters = {
  language: 'en' | 'th';
  view: View;
  kind?: CommunityPostKind;
};

const authorOptions = [
  { value: false, label: '전체' },
  { value: true, label: '팔로우한 작성자' },
] as const;

/** 언어별 일반 글 검색과 팔로우 목록을 비공개 질문함에서 분리한다. */
export function CommunityList({
  initial,
  source,
  initialLanguage,
  tagged = false,
  isHelper = false,
  initialCompose = false,
  viewerId,
}: {
  initial: CommunityPosts;
  tagged?: boolean;
  isHelper?: boolean;
  initialCompose?: boolean;
  viewerId?: string;
  initialLanguage: 'en' | 'th';
  source?: SourceInput;
}) {
  const [value, setValue] = useState(initial);
  const [language, setLanguage] = useState<'en' | 'th'>(initialLanguage);
  const [q, setQuery] = useState('');
  const [view, setView] = useState<View>('all');
  const [kind, setKind] = useState<CommunityPostKind>();
  const taggedCount = useTaggedCount();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [compose, setCompose] = useState(Boolean(source) || initialCompose);
  const latestRequest = useRef(0);

  async function load(page = 1, next: Partial<Filters> = {}) {
    // 조건을 빠르게 바꾸면 늦게 도착한 이전 응답이 최신 목록을 덮지 않도록 마지막 요청만 반영한다.
    const request = ++latestRequest.current;

    setBusy(true);
    setError('');

    try {
      const filters = { language, view, kind, ...next };

      const result = await listCommunityPosts({
        language: filters.language,
        q,
        following: filters.view === 'following',
        helpers: filters.view === 'helpers',
        kind: filters.kind,
        page,
        tagged,
      });

      if (request === latestRequest.current) setValue(result);
    } catch (error) {
      if (request !== latestRequest.current) return;
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      if (request === latestRequest.current) setBusy(false);
    }
  }

  function changeView(next: View) {
    setView(next);
    void load(1, { view: next });
  }

  function changeKind(next: CommunityPostKind | undefined) {
    setKind(next);
    // 전체로 되돌릴 때 undefined가 기존 값에 묻히지 않게 키를 명시해 넘긴다.
    void load(1, { kind: next });
  }

  function changeLanguage(next: 'en' | 'th') {
    setLanguage(next);
    void load(1, { language: next });
  }

  const languageSection = (
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
            disabled={busy}
            aria-pressed={language === option.value}
            onClick={() => changeLanguage(option.value)}>
            {option.label}
          </Button>
        ))}
      </div>
    </section>
  );

  const kindSection = (
    <section
      className={styles.languages}
      aria-labelledby='community-kind'>
      <Text
        as='p'
        id='community-kind'
        display='block'
        size='sm'
        weight='bold'
        color='secondary'>
        글 종류
      </Text>
      <div
        role='group'
        aria-labelledby='community-kind'
        className={styles.languageOptions}>
        {kindOptions.map((option) => (
          <Button
            key={option.label}
            type='button'
            variant='secondary'
            size='small'
            disabled={busy}
            aria-pressed={kind === option.value}
            onClick={() => changeKind(option.value)}>
            {option.label}
          </Button>
        ))}
      </div>
    </section>
  );

  const taggedBadge = <TaggedCountBadge count={taggedCount.count} />;

  return (
    <div className={styles.root}>
      <aside
        className={styles.aside}
        aria-label='커뮤니티 보기'>
        {tagged ? (
          <>
            <nav
              aria-label='글 모아보기'
              className={styles.views}>
              <SideNavItem
                href='/community'
                icon='list'
                label='전체 글'
              />
              <SideNavItem
                href='/community/tagged'
                icon='at-sign'
                label='나를 태그한 글'
                endContent={taggedBadge}
                isSelected
              />
            </nav>
            <section
              className={styles.languages}
              aria-labelledby='community-author'>
              <Text
                as='p'
                id='community-author'
                display='block'
                size='sm'
                weight='bold'
                color='secondary'>
                작성자
              </Text>
              <div
                role='group'
                aria-labelledby='community-author'
                className={styles.languageOptions}>
                {authorOptions.map((option) => (
                  <Button
                    key={option.label}
                    type='button'
                    variant='secondary'
                    size='small'
                    disabled={busy}
                    aria-pressed={(view === 'following') === option.value}
                    onClick={() =>
                      changeView(option.value ? 'following' : 'all')
                    }>
                    {option.label}
                  </Button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <nav
            aria-label='글 모아보기'
            className={styles.views}>
            <SideNavItem
              icon='list'
              label='전체 글'
              isSelected={view === 'all'}
              onClick={() => changeView('all')}
            />
            {isHelper && (
              <SideNavItem
                href='/community/tagged'
                icon='at-sign'
                label='나를 태그한 글'
                endContent={taggedBadge}
              />
            )}
            <SideNavItem
              icon='user-plus'
              label='팔로우한 작성자'
              isSelected={view === 'following'}
              onClick={() => changeView('following')}
            />
            <SideNavItem
              icon='graduation-cap'
              label='조교와 함께 보는 글'
              isSelected={view === 'helpers'}
              onClick={() => changeView('helpers')}
            />
          </nav>
        )}
        {languageSection}
        {kindSection}
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
              color='secondary'
              className={styles.description}>
              {tagged
                ? '학습 경험과 질문을 나누고, 조교를 태그해 함께 이야기해 보세요.'
                : '원문 구절을 함께 보며 묻고 답해요'}
            </Text>
          </div>
          <Button
            type='button'
            variant='ink'
            size='comfortable'
            startIcon='pencil'
            onClick={() => setCompose(true)}>
            글 쓰기
          </Button>
        </div>
        <SearchField
          label='게시글 검색'
          placeholder='제목과 내용 검색'
          value={q}
          maxLength={100}
          onChange={setQuery}
          // 일반 목록은 시안대로 버튼 없이 Enter로 검색하고 태그 목록만 제출 버튼을 둔다.
          hasSubmitButton={tagged}
          onSubmit={() => void load()}
        />
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
            variant='dashed'
            iconShape='square'
            headingLevel={2}
            title='이 조건의 글이 없어요'
            description='다른 검색 조건을 선택하거나 첫 학습 경험을 나눠 보세요.'
            icon='message-circle'
          />
        ) : (
          <ul
            className={styles.list}
            aria-busy={busy}>
            {value.items.map((item) => (
              <li key={item.id}>
                <CommunityPostCard
                  item={item}
                  highlightHelperId={viewerId}
                  showVisibility={tagged}
                />
              </li>
            ))}
          </ul>
        )}
        <Pagination
          page={value.page}
          hasNext={value.hasMore}
          isDisabled={busy}
          onPageChange={(page) => void load(page)}
        />
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
