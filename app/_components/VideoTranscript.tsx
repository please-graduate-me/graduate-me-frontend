'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as styles from './VideoTranscript.css';

type TranscriptSegment = { id: string; start: number; text: string };
type VideoTranscriptProps = {
  children: ReactNode;
  segments: TranscriptSegment[];
  currentId?: string;
  initialVisitedIds?: string[];
  resetVersion?: number;
};

/** 방문한 구절만 영상 옆에 누적해 아직 보지 않은 문장을 미리 노출하지 않는다. */
export function VideoTranscript({
  children,
  segments,
  currentId,
  initialVisitedIds = [],
  resetVersion = 0,
}: VideoTranscriptProps) {
  const [visitedIds, setVisitedIds] = useState(initialVisitedIds);

  const [previousResetVersion, setPreviousResetVersion] =
    useState(resetVersion);

  const list = useRef<HTMLOListElement>(null);

  // 현재 구절은 채점 결과와 무관하게 방문 시점부터 대본에 남긴다.
  if (previousResetVersion !== resetVersion) {
    setPreviousResetVersion(resetVersion);
    setVisitedIds(currentId ? [currentId] : []);
  } else if (currentId && !visitedIds.includes(currentId))
    setVisitedIds([...visitedIds, currentId]);

  const visible = segments.filter((segment) => visitedIds.includes(segment.id));

  useEffect(() => {
    const active = list.current?.querySelector<HTMLElement>(
      '[aria-current="true"]'
    );

    if (active && list.current) list.current.scrollTop = active.offsetTop;
  }, [currentId]);

  return (
    <div className={styles.layout}>
      <div className={styles.video}>{children}</div>
      <aside
        className={styles.transcript}
        aria-label='진행한 문장 대본'>
        <div className={styles.heading}>
          <h3 className={styles.title}>대본</h3>
          <span className={styles.count}>{visible.length}문장</span>
        </div>
        <p className={styles.description}>이동한 문장이 여기에 쌓여요.</p>
        <ol
          className={styles.sentences}
          ref={list}>
          {visible.map((segment) => (
            <li
              key={segment.id}
              className={styles.sentence}
              aria-current={segment.id === currentId ? 'true' : undefined}>
              <span className={styles.time}>
                {Math.floor(segment.start / 60)}:
                {String(Math.floor(segment.start % 60)).padStart(2, '0')}
              </span>
              <p className={styles.text}>{segment.text}</p>
            </li>
          ))}
        </ol>
        {!visible.length && (
          <p className={styles.description}>첫 문장을 기다리고 있어요.</p>
        )}
      </aside>
    </div>
  );
}
