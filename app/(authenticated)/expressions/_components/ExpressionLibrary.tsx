'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Expression } from '@/domains/expressions/model/contracts';
import { sourceLabel, formatDate } from '@/domains/learning/lib/format';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Select } from '@/components/ui/primitives/Select';
import { Icon } from '@/components/ui/primitives/Icon';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { ExpressionDetail } from './ExpressionDetail';
import * as styles from '@/lib/styles/workspace.css';
import * as expressionStyles from './ExpressionLibrary.css';

/** 표현 검색과 출처별 탐색을 개인 메모 상세와 연결한다. */
export function ExpressionLibrary({ initial }: { initial: Expression[] }) {
  const [items, setItems] = useState(initial);
  const [selectedId, setSelectedId] = useState(initial[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | 'pdf' | 'video'>('all');
  const [language, setLanguage] = useState('all');

  const [entryKind, setEntryKind] = useState<
    'all' | 'vocabulary' | 'sentence' | 'concept'
  >('all');

  const [review, setReview] = useState('all');
  const [sort, setSort] = useState('recent');

  const filtered = items
    .filter(
      (item) =>
        (kind === 'all' || item.source.kind === kind) &&
        (language === 'all' || item.source.language === language) &&
        (entryKind === 'all' ||
          (entryKind === 'vocabulary'
            ? item.kind === 'word' || item.kind === 'phrase'
            : item.kind === entryKind)) &&
        (review === 'all' || item.reviewIncluded === (review === 'included')) &&
        `${item.text} ${item.meaning} ${item.note} ${item.source.title}`
          .toLowerCase()
          .includes(query.toLowerCase())
    )
    .sort((a, b) =>
      sort === 'oldest'
        ? Date.parse(a.createdAt) - Date.parse(b.createdAt)
        : Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );

  const selected =
    filtered.find((item) => item.id === selectedId) ?? filtered[0];

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>개인 표현집</h1>
          <p className={styles.description}>
            내가 발견한 표현과 문맥을 모아 두는 곳
          </p>
        </div>
        <ButtonLink
          href='/materials'
          className={styles.link}>
          원문에서 표현 추가
        </ButtonLink>
      </div>
      <div className={styles.tabs}>
        {(
          [
            ['all', '전체'],
            ['vocabulary', '단어·표현'],
            ['sentence', '문장'],
            ['concept', '개념'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type='button'
            className={styles.tab}
            aria-pressed={entryKind === value}
            onClick={() => setEntryKind(value)}>
            {label}{' '}
            {value === 'all'
              ? items.length
              : items.filter((item) =>
                  value === 'vocabulary'
                    ? item.kind === 'word' || item.kind === 'phrase'
                    : item.kind === value
                ).length}
          </button>
        ))}
      </div>
      {!items.length ? (
        <EmptyState
          title='아직 저장한 표현이 없어요'
          icon='bookmark'
          description='원문에서 인상 깊은 구절을 선택하고 표현 저장을 눌러 보세요.'>
          <Link
            href='/materials'
            className={styles.link}>
            자료 보관함으로
          </Link>
        </EmptyState>
      ) : (
        <div className={expressionStyles.columns}>
          <section>
            <div className={styles.filters}>
              <Input
                aria-label='표현이나 뜻 검색'
                placeholder='표현이나 뜻으로 찾기'
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Icon
                name='search'
                size={18}
              />
            </div>
            <div className={styles.filters}>
              <Select
                aria-label='표현 언어'
                value={language}
                onChange={(event) => setLanguage(event.target.value)}>
                <option value='all'>모든 언어</option>
                <option value='en'>영어</option>
                <option value='th'>태국어</option>
              </Select>
              <Select
                aria-label='표현 출처'
                value={kind}
                onChange={(event) =>
                  setKind(event.target.value as typeof kind)
                }>
                <option value='all'>모든 출처</option>
                <option value='pdf'>PDF에서</option>
                <option value='video'>영상에서</option>
              </Select>
              <Select
                aria-label='복습 포함 상태'
                value={review}
                onChange={(event) => setReview(event.target.value)}>
                <option value='all'>모든 복습 상태</option>
                <option value='included'>복습에 포함</option>
                <option value='excluded'>잠시 제외</option>
              </Select>
              <Select
                aria-label='표현 저장 순서'
                value={sort}
                onChange={(event) => setSort(event.target.value)}>
                <option value='recent'>최근 저장순</option>
                <option value='oldest'>오래된 저장순</option>
              </Select>
            </div>
            <p className={styles.meta}>
              {sort === 'oldest' ? '오래된 저장순' : '최근 저장순'} ·{' '}
              {filtered.length}개
            </p>
            <ul className={styles.list}>
              {filtered.map((item) => (
                <li key={item.id}>
                  <button
                    type='button'
                    className={styles.listItem}
                    aria-pressed={selected?.id === item.id}
                    onClick={() => setSelectedId(item.id)}>
                    <div className={styles.row}>
                      <strong className={styles.link}>{item.text}</strong>
                      <span className={styles.meta}>
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <p>{item.meaning || '뜻을 정리해 보세요.'}</p>
                    <span className={styles.meta}>
                      {sourceLabel(item.source)} · {item.source.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {!filtered.length && (
              <EmptyState
                title='검색한 표현이 없어요'
                description='다른 검색어나 출처를 선택해 보세요.'
                icon='search'>
                <Button
                  variant='secondary'
                  onClick={() => {
                    setQuery('');
                    setKind('all');
                    setLanguage('all');
                    setEntryKind('all');
                    setReview('all');
                  }}>
                  전체 표현 보기
                </Button>
              </EmptyState>
            )}
          </section>
          {selected && (
            <ExpressionDetail
              key={selected.id}
              expression={selected}
              onChange={(updated) =>
                setItems((previous) =>
                  previous.map((item) =>
                    item.id === updated.id ? updated : item
                  )
                )
              }
              onDelete={() =>
                setItems((previous) =>
                  previous.filter((item) => item.id !== selected.id)
                )
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
