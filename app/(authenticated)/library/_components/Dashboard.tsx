'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Panel } from '@/components/ui/layouts/Panel';
import { Button } from '@/components/ui/primitives/Button';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { getLearningSummary } from '@/domains/learning/api/summary';
import type { LearningSummary } from '@/domains/learning/model/summary';
import { materialPaths } from '@/domains/materials/config/paths';
import { sourceLabel, formatDate } from '@/domains/learning/lib/format';
import { MyVideos } from './MyVideos';
import * as styles from './Dashboard.css';

/** 학습 홈의 자료, 복습과 공개 질문 상태를 실제 계정 데이터로 연결한다. */
export function Dashboard() {
  const [summary, setSummary] = useState<LearningSummary | null>(null);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let disposed = false;

    getLearningSummary()
      .then((data) => {
        if (!disposed) {
          setSummary(data);
          setError('');
        }
      })
      .catch((error: Error) => {
        if (!disposed) setError(error.message);
      });

    return () => {
      disposed = true;
    };
  }, [reload]);

  const question = summary?.recentQuestions.find(
    (item) => item.status === 'answered'
  );

  const expression = summary?.recentExpressions[0];

  return (
    <div className={styles.workspace}>
      <div className={styles.library}>
        {error && (
          <div
            className={styles.error}
            role='alert'>
            <p>{error}</p>
            <Button
              variant='secondary'
              size='small'
              onClick={() => setReload((value) => value + 1)}>
              학습 요약 다시 불러오기
            </Button>
          </div>
        )}
        <MyVideos
          materials={summary?.recentMaterials ?? []}
          materialCount={summary?.materials ?? 0}
          summaryLoading={!summary && !error}
        />
      </div>
      <aside
        className={styles.sidebar}
        aria-label='표현 복습과 질문'>
        <Panel className={styles.review}>
          <span className={styles.eyebrow}>
            <Icon
              name='repeat-2'
              size={18}
            />
            오늘의 복습
          </span>
          <h2>
            배운 표현,
            <br />한 번 더 기억하기
          </h2>
          <p>
            {summary
              ? summary.expressions > 0
                ? '저장한 표현 ' +
                  summary.expressions +
                  '개를 나의 속도로 복습해 보세요.'
                : '학습하면서 기억하고 싶은 표현을 저장해 보세요.'
              : error
                ? '표현집에서 저장한 표현을 확인해 보세요.'
                : '나의 표현을 불러오고 있어요.'}
          </p>
          <Link
            href={summary?.expressions ? '/practice' : '/expressions'}
            className={styles.primaryLink}>
            {summary?.expressions ? '표현 복습하기' : '개인 표현집 열기'}
            <Icon
              name='arrow-right'
              size={16}
            />
          </Link>
        </Panel>
        <section className={styles.sideSection}>
          <div className={styles.sectionHeading}>
            <h2>도우미 답변</h2>
            <Link href='/questions'>전체 보기</Link>
          </div>
          {question ? (
            <div className={styles.answer}>
              <Badge tone='success'>답변 도착</Badge>
              <h3>
                <Link href={'/questions/' + encodeURIComponent(question.id)}>
                  {question.title}
                </Link>
              </h3>
              <p>
                {question.assignee?.name ?? '담당 도우미'} ·{' '}
                {formatDate(question.updatedAt)}
              </p>
              <Link
                className={styles.source}
                href={materialPaths.source(question.source)}>
                <Icon
                  name={question.source.kind === 'pdf' ? 'file-text' : 'play'}
                  size={14}
                />
                {sourceLabel(question.source)}
              </Link>
              <Link
                className={styles.textLink}
                href={'/questions/' + encodeURIComponent(question.id)}>
                답변 확인하기
                <Icon
                  name='arrow-right'
                  size={14}
                />
              </Link>
            </div>
          ) : (
            <div className={styles.sideEmpty}>
              <Icon name='message-circle' />
              <p>
                {summary?.unanswered
                  ? summary.unanswered + '개 질문의 답변을 기다리고 있어요.'
                  : '궁금한 구절을 선택해 도우미에게 질문해 보세요.'}
              </p>
              <Link href='/questions'>나의 질문 보기</Link>
            </div>
          )}
        </section>
        <section className={styles.sideSection}>
          <h2>최근 저장한 표현</h2>
          {expression ? (
            <div className={styles.savedExpression}>
              <h3>{expression.text}</h3>
              <p>
                {expression.meaning || '표현집에서 나만의 뜻을 기록해 보세요.'}
              </p>
              <Link
                className={styles.source}
                href={materialPaths.source(expression.source)}>
                <Icon
                  name={expression.source.kind === 'pdf' ? 'file-text' : 'play'}
                  size={14}
                />
                {sourceLabel(expression.source)}
              </Link>
              <Link
                className={styles.textLink}
                href='/expressions'>
                표현집에서 보기
                <Icon
                  name='arrow-right'
                  size={14}
                />
              </Link>
            </div>
          ) : (
            <div className={styles.sideEmpty}>
              <Icon name='bookmark' />
              <p>저장한 표현이 이곳에 표시돼요.</p>
              <Link href='/materials'>자료에서 표현 찾기</Link>
            </div>
          )}
        </section>
      </aside>
    </div>
  );
}
