'use client';
import { Select } from '@/components/ui/primitives/Select';
import { useState } from 'react';
import Link from 'next/link';
import type { LearningHistory } from '@/domains/learning/model/history';
import { formatDate } from '@/domains/learning/lib/format';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import * as styles from '@/lib/styles/workspace.css';

const labels = {
  practice: '자가점검',
  question: '질문',
  material: '자료',
  exercise: '적용 문제',
  video: '받아쓰기',
  annotation: '하이라이트·메모',
  explanation: 'AI 설명',
  conversation: 'AI 대화',
} as const;

/** 저장된 학습 활동과 실제 정오 판정을 별도로 보여준다. */
export function LearningHistoryList({ items }: { items: LearningHistory }) {
  const [language, setLanguage] = useState<'all' | 'en' | 'th'>('all');

  const [kind, setKind] = useState<'all' | LearningHistory[number]['kind']>(
    'all'
  );

  const filtered = items.filter(
    (item) =>
      (kind === 'all' || item.kind === kind) &&
      (language === 'all' || item.language === language)
  );

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>학습 기록</h1>
          <p className={styles.description}>
            내가 읽고 질문하고 복습한 시간을 돌아보세요.
          </p>
        </div>
        <Badge tone='neutral'>실제 저장된 활동</Badge>
      </div>
      <p className={styles.meta}>
        서버에 저장된 개별 활동을 최근 순으로 표시합니다. 받아쓰기는 구절별
        제출, 적용 문제는 저장 문제별 제출이며 자가점검은 본인 판단입니다. 도움
        사용과 정오 판정은 각 활동의 상세 기록에서 확인할 수 있습니다.
      </p>
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
      </div>
      <div className={styles.tabs}>
        {(
          [
            ['all', '전체'],
            ['practice', '자가점검'],
            ['question', '질문'],
            ['material', '자료'],
            ['exercise', '적용 문제'],
            ['video', '받아쓰기'],
            ['annotation', '위치 메모'],
            ['explanation', 'AI 설명'],
            ['conversation', 'AI 대화'],
          ] as const
        ).map(([value, label]) => (
          <button
            type='button'
            key={value}
            className={styles.tab}
            aria-pressed={kind === value}
            onClick={() => setKind(value)}>
            {label}
          </button>
        ))}
      </div>
      {!filtered.length ? (
        <EmptyState
          title='아직 기록된 활동이 없어요'
          description='자료를 등록하거나 원문에서 질문하고 저장한 표현을 복습해 보세요.'
          icon='chart-no-axes-column'
        />
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>활동</th>
              <th>내용</th>
              <th>시각</th>
              <th>바로가기</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={`${item.kind}:${item.id}`}>
                <td>
                  <Badge
                    tone={
                      item.kind === 'practice'
                        ? 'success'
                        : item.kind === 'question'
                          ? 'brand'
                          : 'neutral'
                    }>
                    <Icon
                      name={
                        item.kind === 'practice'
                          ? 'repeat-2'
                          : item.kind === 'question'
                            ? 'message-circle'
                            : 'file-text'
                      }
                      size={16}
                    />
                    {labels[item.kind]}
                  </Badge>
                </td>
                <td>
                  <strong>{item.title}</strong>
                  <p className={styles.meta}>{item.detail}</p>
                </td>
                <td className={styles.meta}>{formatDate(item.createdAt)}</td>
                <td>
                  <Link
                    href={item.href}
                    className={styles.link}>
                    이어서 보기 ↗
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
