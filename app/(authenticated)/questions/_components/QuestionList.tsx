'use client';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Button } from '@/components/ui/primitives/Button';
import { useState } from 'react';
import type { QuestionSummary } from '@/domains/questions/model/contracts';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { SearchField } from '@/components/ui/composites/SearchField';
import { SideNavItem } from '@/components/ui/layouts/SideNavItem';
import { QuestionCard } from './QuestionCard';
import * as styles from './QuestionList.css';

const statuses = [
  ['all', '전체'],
  ['waiting', '답변 대기'],
  ['answered', '답변 완료'],
] as const;

const languages = [
  ['all', '모든 언어'],
  ['en', '영어'],
  ['th', '태국어'],
] as const;

/** 학생의 질문만 검색하고 공개 답변 상세로 연결한다. */
export function QuestionList({ initial }: { initial: QuestionSummary[] }) {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<'all' | 'en' | 'th'>('all');
  const [status, setStatus] = useState<'all' | 'waiting' | 'answered'>('all');

  const items = initial.filter(
    (item) =>
      (status === 'all' || item.status === status) &&
      (language === 'all' || item.source.language === language) &&
      item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.root}>
      <aside
        aria-label='질문 모아보기'
        className={styles.aside}>
        <div
          role='group'
          aria-label='답변 상태'
          className={styles.views}>
          {statuses.map(([value, label]) => (
            <SideNavItem
              key={value}
              label={label}
              isSelected={status === value}
              onClick={() => setStatus(value)}
              // 상태별 개수는 언어·검색 조건과 무관하게 전체 질문 기준으로 센다.
              endContent={
                initial.filter(
                  (item) => value === 'all' || item.status === value
                ).length
              }
            />
          ))}
        </div>
        <section
          className={styles.languages}
          aria-labelledby='question-language'>
          <Text
            as='p'
            id='question-language'
            display='block'
            size='sm'
            weight='bold'
            color='secondary'>
            학습 언어
          </Text>
          <div
            role='group'
            aria-labelledby='question-language'
            className={styles.languageOptions}>
            {languages.map(([value, label]) => (
              <Button
                key={value}
                type='button'
                variant='secondary'
                size='small'
                aria-pressed={language === value}
                onClick={() => setLanguage(value)}>
                {label}
              </Button>
            ))}
          </div>
        </section>
      </aside>
      <div className={styles.main}>
        <div className={styles.intro}>
          <div>
            <Heading level={1}>나의 질문</Heading>
            <Text
              as='p'
              display='block'
              color='secondary'
              className={styles.description}>
              원문에서 궁금했던 점과 학과 도우미의 답변을 확인하세요.
            </Text>
          </div>
          <ButtonLink
            // 새 개인 질문은 받지 않으므로 조교를 태그할 수 있는 커뮤니티 글쓰기를 바로 연다.
            href='/community?compose=1'
            variant='ink'
            size='comfortable'
            startIcon='send'>
            커뮤니티에 질문하기
          </ButtonLink>
        </div>
        <SearchField
          label='내 질문 제목 검색'
          placeholder='질문 제목으로 찾기'
          value={query}
          onChange={setQuery}
        />
        {!items.length ? (
          <EmptyState
            variant='dashed'
            iconShape='square'
            headingLevel={2}
            title={query ? '검색한 질문이 없어요' : '아직 질문이 없어요'}
            icon='message-circle'
            description='새 질문은 학습 커뮤니티에서 조교를 태그해 남길 수 있어요. 이곳에는 이전에 보낸 질문과 답변이 보관돼요.'
          />
        ) : (
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <QuestionCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
