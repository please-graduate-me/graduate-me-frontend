'use client';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/primitives/Button';
import { createShare } from '@/domains/shares/api/shares';
import * as styles from './ShareButton.css';

/** 복사 권한이 없어도 생성한 링크를 직접 복사할 수 있게 한다. */
export function ShareButton({
  videoId,
  segmentId,
  className,
}: {
  videoId: string;
  segmentId?: string;
  className?: string;
}) {
  const requestId = useRef<string | null>(null);
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function share() {
    if (busy) return;
    setBusy(true);
    setMessage('');

    try {
      let link = url;

      if (!link) {
        requestId.current ??= crypto.randomUUID();

        const result = await createShare({
          videoId,
          segmentId,
          requestId: requestId.current,
        });

        link = new URL(result.path, window.location.origin).href;
        setUrl(link);
      }

      try {
        await navigator.clipboard.writeText(link);
        setMessage('공유 링크를 복사했습니다.');
      } catch {
        setMessage('아래 링크를 선택해 직접 복사해 주세요.');
      }
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.container}>
      <Button
        className={className}
        variant='secondary'
        disabled={busy}
        onClick={() => void share()}>
        {busy
          ? '공유 링크 만드는 중…'
          : segmentId
            ? '이 구절 공유'
            : '영상 공유'}
      </Button>
      {url && (
        <input
          className={styles.link}
          readOnly
          aria-label={segmentId ? '구절 공유 링크' : '영상 공유 링크'}
          value={url}
          onFocus={(event) => event.target.select()}
        />
      )}
      {message && (
        <p
          className={styles.message}
          role='status'>
          {message}
        </p>
      )}
    </div>
  );
}
