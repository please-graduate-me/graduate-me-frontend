'use client';
import { Select } from '@/components/ui/primitives/Select';
import { useState } from 'react';
import Link from 'next/link';
import type { QuestionSummary } from '@/domains/questions/model/contracts';
import { formatDate, sourceLabel } from '@/domains/learning/lib/format';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Input } from '@/components/ui/primitives/Input';
import { Badge } from '@/components/ui/primitives/Badge';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import * as styles from '@/lib/styles/workspace.css';

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
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>나의 질문</h1>
          <p className={styles.description}>
            원문에서 궁금했던 점과 학과 도우미의 답변을 확인하세요.
          </p>
        </div>
        <ButtonLink
          className={styles.link}
          href='/materials'>
          원문에서 질문하기
        </ButtonLink>
      </div>
      <div className={styles.tabs}>
        {(
          [
            ['all', '전체'],
            ['waiting', '답변 대기'],
            ['answered', '답변 완료'],
          ] as const
        ).map(([value, label]) => (
          <button
            type='button'
            className={styles.tab}
            key={value}
            aria-pressed={status === value}
            onClick={() => setStatus(value)}>
            {label}{' '}
            {
              initial.filter((item) => value === 'all' || item.status === value)
                .length
            }
          </button>
        ))}
      </div>
      <div className={styles.filters}>
        <label>
          학습 언어{' '}
          <Select
            aria-label='학습 언어 필터'
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as typeof language)
            }>
            <option value='all'>모든 언어</option>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
        </label>
        <Input
          aria-label='내 질문 제목 검색'
          placeholder='질문 제목으로 찾기'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {!items.length ? (
        <EmptyState
          title={query ? '검색한 질문이 없어요' : '아직 질문이 없어요'}
          icon='message-circle'
          description='PDF나 영상에서 구절을 선택하고 담당 커뮤니티에 질문해 보세요.'
        />
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>질문</th>
              <th>원문 근거</th>
              <th>답변 도우미</th>
              <th>상태</th>
              <th>최근 활동</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link
                    className={styles.link}
                    href={`/questions/${encodeURIComponent(item.id)}`}>
                    {item.title}
                  </Link>
                </td>
                <td>
                  <p>{item.source.title}</p>
                  <span className={styles.meta}>
                    {sourceLabel(item.source)}
                  </span>
                </td>
                <td>{item.assignee?.name ?? '배정 대기'}</td>
                <td>
                  <Badge
                    tone={item.status === 'answered' ? 'success' : 'brand'}>
                    {item.status === 'answered' ? '답변 완료' : '답변 대기'}
                  </Badge>
                </td>
                <td className={styles.meta}>{formatDate(item.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
