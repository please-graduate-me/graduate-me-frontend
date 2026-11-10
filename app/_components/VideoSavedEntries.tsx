'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listExpressions } from '@/domains/expressions/api/expressions';
import type { Expression } from '@/domains/expressions/model/contracts';
import { listAnnotations } from '@/domains/materials/api/records';
import type { Annotation } from '@/domains/materials/model/records';
import { materialPaths } from '@/domains/materials/config/paths';
import { AnnotationList } from './AnnotationList';
import { Button } from '@/components/ui/primitives/Button';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import * as styles from '@/lib/styles/workspace.css';

/** 현재 영상의 개인 표현과 위치 메모를 저장된 결과 조회만으로 보여 준다. */
export function VideoSavedEntries({ videoId }: { videoId: string }) {
  const [expressions, setExpressions] = useState<Expression[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;

    void Promise.all([listExpressions(), listAnnotations({ videoId })])
      .then(([entries, notes]) => {
        if (!active) return;

        setExpressions(
          entries.items.filter(
            (item) =>
              item.source.kind === 'video' && item.source.videoId === videoId
          )
        );

        setAnnotations(notes.items);
        setLoading(false);
        setError('');
      })
      .catch((error) => {
        if (active) {
          setError(error.message);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [videoId, reload]);

  return (
    <div className={styles.stack}>
      <div className={styles.row}>
        <h3>내 표현과 메모</h3>
        <Button
          size='small'
          variant='ghost'
          disabled={loading}
          onClick={() => {
            setLoading(true);
            setReload((value) => value + 1);
          }}>
          저장 결과 조회
        </Button>
      </div>
      {loading && (
        <p
          className={styles.meta}
          role='status'>
          이 영상에서 저장한 개인 기록을 불러오고 있어요.
        </p>
      )}
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
      {!loading && !error && !expressions.length && !annotations.length && (
        <EmptyState
          icon='bookmark'
          title='아직 저장한 기록이 없어요'
          description='확인한 구절에서 표현이나 메모를 저장해 보세요.'
        />
      )}
      {expressions.map((item) => (
        <article
          className={styles.message}
          key={item.id}>
          <Link
            className={styles.link}
            href={materialPaths.source(item.source)}>
            {item.text}
          </Link>
          <p>{item.meaning || '정리한 뜻 없음'}</p>
          <p className={styles.meta}>
            원문 v{item.source.version ?? 1} · {item.source.start?.toFixed(1)}초
          </p>
          {item.note && <p className={styles.prose}>{item.note}</p>}
          <Link
            href='/expressions'
            className={styles.link}>
            표현집에서 편집
          </Link>
        </article>
      ))}
      <AnnotationList
        items={annotations}
        onChange={(value) =>
          setAnnotations((previous) =>
            previous.map((item) => (item.id === value.id ? value : item))
          )
        }
        onDelete={(id) =>
          setAnnotations((previous) =>
            previous.filter((item) => item.id !== id)
          )
        }
      />
    </div>
  );
}
