'use client';
import { Banner } from '@/components/ui/composites/Banner';
import { Text } from '@/components/ui/primitives/Text';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/primitives/Button';
import { Icon } from '@/components/ui/primitives/Icon';
import {
  recordShareVisit,
  startSharedLesson,
} from '@/domains/shares/api/shares';
import { videoPaths } from '@/domains/videos/config/paths';
import * as styles from './SharedEntry.css';
import { shareVisitSchema } from '@/domains/shares/model/contracts';

/** 새로고침 중에도 같은 탭의 방문을 중복 집계하지 않는다. */
export function SharedEntry({ id, segment }: { id: string; segment: boolean }) {
  const router = useRouter();
  const visitId = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const getVisitId = useCallback(() => {
    if (visitId.current) return visitId.current;
    const key = `share-visit:${id}`;
    let stored: string | null = null;

    try {
      stored = sessionStorage.getItem(key);
    } catch {
      // 저장소 제한 시 현재 화면에서만 중복을 막는다.
    }

    visitId.current =
      stored && shareVisitSchema.safeParse({ visitId: stored }).success
        ? stored
        : crypto.randomUUID();

    try {
      sessionStorage.setItem(key, visitId.current);
    } catch {
      // 집계 실패로 학습 진입을 막지 않는다.
    }

    return visitId.current;
  }, [id]);

  useEffect(() => {
    void recordShareVisit(id, getVisitId()).catch(() => undefined);
  }, [id, getVisitId]);

  async function start() {
    if (busy) return;
    setBusy(true);
    setError('');

    try {
      const result = await startSharedLesson(id, getVisitId());

      router.push(videoPaths.lesson(result.videoId));
    } catch (error) {
      setError((error as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className={styles.entry}>
      <Button
        type='button'
        variant='ink'
        size='prominent'
        className={styles.start}
        // 비활성 회색 대신 먹색을 유지해 준비 중 고리가 보이게 하고 중복 시작은 start가 막는다.
        aria-busy={busy}
        aria-disabled={busy}
        onClick={() => void start()}>
        {busy ? (
          <>
            <span
              aria-hidden='true'
              className={styles.spinner}
            />
            학습 준비 중…
          </>
        ) : (
          <>
            {segment ? '이 구절부터 학습' : '내 학습에 추가하고 시작'}
            <Icon
              name='arrow-right'
              size={18}
            />
          </>
        )}
      </Button>
      {segment && (
        <Text
          as='p'
          display='block'
          className={styles.note}>
          해당 구절로 이동합니다.
          <br />
          기존 답안은 유지됩니다.
        </Text>
      )}
      {error && (
        <Banner
          status='error'
          title='확인이 필요해요'
          layout='inline'
          isOutlined
          className={styles.error}
          role='alert'>
          {error}
        </Banner>
      )}
    </div>
  );
}
