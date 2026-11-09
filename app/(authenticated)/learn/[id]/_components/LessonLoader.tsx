'use client';
import { Button } from '@/components/ui/primitives/Button';
import { Panel } from '@/components/ui/layouts/Panel';
import * as styles from './LessonLoader.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLesson } from '@/domains/videos/api/videos';
import { jobLabels, learningConfig } from '@/domains/videos/config/catalog';
import { videoPaths } from '@/domains/videos/config/paths';
import type { Lesson } from '@/domains/videos/model/contracts';
import { Study } from '../../../../_components/Study';

/** 준비 상태 조회가 진행 중인 학습 입력을 덮어쓰지 않게 한다. */
export function LessonLoader({ initial }: { initial: Lesson }) {
  const videoId = initial.video.id;
  const [lesson, setLesson] = useState<Lesson>(initial);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const pending = (value: Lesson) =>
      !['ready', 'failed'].includes(value.job?.status ?? '') ||
      Object.entries(value.preparation ?? {}).some(
        ([key, status]) => key !== 'error' && status === 'pending'
      );

    if (!pending(initial) && reload === 0) return;
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;

    async function refresh() {
      try {
        const result = await getLesson(videoId);

        if (disposed) return;
        setLesson(result);
        setError('');
        if (pending(result))
          timer = setTimeout(refresh, learningConfig.pollInterval);
      } catch (error) {
        if (!disposed) setError((error as Error).message);
      }
    }

    void refresh();

    return () => {
      disposed = true;
      clearTimeout(timer);
    };
  }, [videoId, reload, initial]);

  if (lesson?.job?.status === 'ready')
    return (
      <Study
        key={videoId}
        initial={lesson}
      />
    );

  return (
    <>
      <Link href={videoPaths.library}>← 영상 목록</Link>
      <Panel className={[styles.processing].join(' ')}>
        <h1>{lesson?.video.title ?? '학습 영상 불러오기'}</h1>
        <p role='status'>
          {lesson?.job ? jobLabels[lesson.job.status] : '잠시 기다려 주세요.'}
        </p>
        {lesson?.job?.status !== 'failed' && (
          <p className={styles.muted}>
            오디오를 구절별 학습 자료로 만들고 있어요. 페이지를 닫아도 처리는
            계속됩니다.
          </p>
        )}
        {lesson?.job?.errorMessage && (
          <p className={styles.notice}>{lesson.job.errorMessage}</p>
        )}
        {lesson?.job?.status === 'failed' && (
          <p className={styles.muted}>
            자료 분석에 실패했습니다. 원인을 확인하고 다른 자료를 등록해 주세요.
          </p>
        )}
        {error && (
          <div
            role='alert'
            className={styles.error}>
            {error}{' '}
            <Button
              variant='secondary'
              onClick={() => setReload((value) => value + 1)}>
              상태 다시 확인
            </Button>
          </div>
        )}
      </Panel>
    </>
  );
}
