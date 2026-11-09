'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { LearningHistory } from '@/domains/learning/model/history';
import { formatDate } from '@/domains/learning/lib/format';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import * as styles from '@/lib/styles/workspace.css';

/** 자가점검과 질문 및 자료 등록의 실제 활동을 구분해 보여준다. */
export function LearningHistoryList({ items }: { items: LearningHistory }) {
  const [kind, setKind] = useState<'all' | LearningHistory[number]['kind']>(
    'all'
  );

  const filtered = items.filter((item) => kind === 'all' || item.kind === kind);

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
      <div className={styles.tabs}>
        {(
          [
            ['all', '전체'],
            ['practice', '자가점검'],
            ['question', '질문'],
            ['material', '자료'],
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
                    {item.kind === 'practice'
                      ? '자가점검'
                      : item.kind === 'question'
                        ? '질문'
                        : '자료 등록'}
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
