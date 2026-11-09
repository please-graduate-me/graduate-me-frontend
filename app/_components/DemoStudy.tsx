'use client';
import { useEffect, useState } from 'react';
import { getDemoLesson } from '@/domains/videos/api/demo';
import type { DemoLesson } from '@/domains/videos/model/demo';
import { createDemoLesson } from '@/domains/videos/lib/demoLesson';
import { Study } from './Study';
import { DemoGuide } from './DemoGuide';
import * as styles from './DemoStudy.css';

/** 체험 자료만 제한하고 실제 학습과 동일한 화면과 동작을 사용한다. */
export function DemoStudy() {
  const [lesson, setLesson] = useState<DemoLesson | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;

    async function refresh() {
      try {
        const result = await getDemoLesson();

        if (disposed) return;
        setLesson(result);
        setError('');
        if (result.status === 'preparing') timer = setTimeout(refresh, 5000);
      } catch {
        if (!disposed) {
          setError('체험 자료를 불러오지 못했습니다. 잠시 후 다시 확인합니다.');
          timer = setTimeout(refresh, 10000);
        }
      }
    }

    void refresh();

    return () => {
      disposed = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      className={styles.root}
      id='demo-study'
      aria-label='로그인 없이 체험하기'>
      <DemoGuide />
      {error && <p role='alert'>{error}</p>}
      {lesson?.status === 'ready' ? (
        <Study
          initial={createDemoLesson(lesson)}
          demo
        />
      ) : (
        <p role='status'>
          {lesson?.status === 'failed'
            ? '체험 영상의 학습 자료를 준비하지 못했습니다. 잠시 후 다시 방문해 주세요.'
            : '체험 영상의 학습 자료를 준비하고 있습니다.'}
        </p>
      )}
    </section>
  );
}
