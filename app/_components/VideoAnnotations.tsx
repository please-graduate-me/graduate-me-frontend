'use client';
import { useEffect, useState } from 'react';
import { listAnnotations } from '@/domains/materials/api/records';
import type { Annotation } from '@/domains/materials/model/records';
import type { SourceInput } from '@/domains/materials/model/source';
import { AnnotationList } from './AnnotationList';
import * as styles from '@/lib/styles/workspace.css';

/** 영상 구절을 다시 열 때 저장한 위치 메모를 복원한다. */
export function VideoAnnotations({
  source,
  reload,
}: {
  source: SourceInput;
  reload: number;
}) {
  const [items, setItems] = useState<Annotation[]>([]);
  const [error, setError] = useState('');
  const videoId = source.kind === 'video' ? source.videoId : '';

  useEffect(() => {
    let active = true;

    void listAnnotations({ videoId })
      .then((value) => {
        if (active) setItems(value.items);
      })
      .catch((error) => {
        if (active) setError(error.message);
      });

    return () => {
      active = false;
    };
  }, [videoId, reload]);

  return (
    <>
      <AnnotationList
        items={items.filter(
          (item) =>
            item.source.kind === 'video' &&
            source.kind === 'video' &&
            item.source.segmentId === source.segmentId &&
            (item.source.version ?? 1) === (source.version ?? 1)
        )}
        onChange={(value) =>
          setItems((previous) =>
            previous.map((item) => (item.id === value.id ? value : item))
          )
        }
        onDelete={(id) =>
          setItems((previous) => previous.filter((item) => item.id !== id))
        }
      />
      {error && (
        <p
          role='alert'
          className={styles.error}>
          {error}
        </p>
      )}
    </>
  );
}
