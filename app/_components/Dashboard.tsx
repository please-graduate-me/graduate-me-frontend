'use client';
import { Button } from '@/components/ui/primitives/Button';
import { Panel } from '@/components/ui/layouts/Panel';
import * as styles from './Dashboard.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recommendations } from '@/domains/videos/config/catalog';
import { registerVideo } from '@/domains/videos/api/videos';
import { videoPaths } from '@/domains/videos/config/paths';
import { MyVideos } from './MyVideos';
/** 영상 선택과 등록 후 이동을 홈 화면에서 조율한다. */
export function Dashboard() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('');
  async function register(value: string) {
    setError('');
    setBusy(true);
    try {
      const result = await registerVideo(value);
      router.push(videoPaths.lesson(result.videoId));
    } catch (error) {
      setError((error as Error).message);
      setBusy(false);
    }
  }
  return (
    <>
      <Panel>
        <h2>학습할 영상 추가</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void register(url);
          }}
          className={styles.urlForm}>
          <label htmlFor='youtube-url'>유튜브 URL</label>
          <div className={styles.row}>
            <input
              id='youtube-url'
              type='url'
              required
              placeholder='https://www.youtube.com/watch?v=...'
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              disabled={busy}
            />
            <Button disabled={busy}>{busy ? '등록 중…' : '학습 시작'}</Button>
          </div>
          <p className={[styles.muted, styles.small].join(' ')}>
            공개된 15분 이하 영어 영상의 링크를 입력해 주세요.
          </p>
        </form>
        {error && (
          <p
            className={styles.error}
            role='alert'>
            {error}
          </p>
        )}
      </Panel>
      <section>
        <div className={styles.sectionHeading}>
          <h2>추천 영상</h2>
          <div className={styles.row}>
            <select
              aria-label='난이도'
              value={level}
              onChange={(event) => setLevel(event.target.value)}>
              <option value=''>모든 난이도</option>
              {['초급', '중급', '고급'].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <select
              aria-label='주제'
              value={topic}
              onChange={(event) => setTopic(event.target.value)}>
              <option value=''>모든 주제</option>
              {recommendations.map((item) => (
                <option key={item.topic}>{item.topic}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.cards}>
          {recommendations
            .filter(
              (item) =>
                (!level || item.level === level) &&
                (!topic || item.topic === topic)
            )
            .map((item) => (
              <Panel
                as='article'
                className={styles.card}

                key={item.youtubeId}>
                <p className={styles.eyebrow}>
                  {item.level} · {item.topic}
                </p>
                <h3>{item.title}</h3>
                <p className={styles.muted}>{item.description}</p>
                <Button
                  variant='secondary'
                  className={styles.cardAction}
                  disabled={busy}
                  onClick={() =>
                    void register(
                      `https://www.youtube.com/watch?v=${item.youtubeId}`
                    )
                  }>
                  이 영상 선택
                </Button>
              </Panel>
            ))}
        </div>
        {!recommendations.some(
          (item) =>
            (!level || item.level === level) && (!topic || item.topic === topic)
        ) && (
          <p className={styles.muted}>
            선택한 조건에 맞는 추천 영상이 없습니다.
          </p>
        )}
      </section>
      <MyVideos />
    </>
  );
}
