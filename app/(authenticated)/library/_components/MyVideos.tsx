'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/primitives/Button';
import {
  listVideos,
  removeVideoFromLibrary,
  setVideoFavorite,
} from '@/domains/videos/api/videos';
import type { VideoHistory } from '@/domains/videos/model/contracts';
import { videoPaths } from '@/domains/videos/config/paths';
import { jobLabels } from '@/domains/videos/config/catalog';
import * as styles from './MyVideos.css';

/** 개인 목록의 탐색과 표시 변경을 홈의 영상 등록과 분리한다. */
export function MyVideos() {
  const [history, setHistory] = useState<VideoHistory | null>(null);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');

  useEffect(() => {
    let disposed = false;

    listVideos()
      .then((items) => {
        if (!disposed) {
          setHistory(items);
          setError('');
        }
      })
      .catch((error) => {
        if (!disposed) setError(error.message);
      });

    return () => {
      disposed = true;
    };
  }, [reload]);

  async function favorite(item: VideoHistory[number]) {
    setBusy(item.videoId);
    setError('');

    try {
      await setVideoFavorite(item.videoId, !item.favorite);

      setHistory(
        (items) =>
          items?.map((row) =>
            row.videoId === item.videoId
              ? { ...row, favorite: !item.favorite }
              : row
          ) ?? null
      );
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function remove(item: VideoHistory[number]) {
    if (
      !window.confirm(
        `‘${item.title}’을 내 목록에서 제거할까요? 학습 기록은 보존되며 같은 링크를 다시 추가하면 복원됩니다.`
      )
    )
      return;
    setBusy(item.videoId);
    setError('');

    try {
      await removeVideoFromLibrary(item.videoId);

      setHistory(
        (items) => items?.filter((row) => row.videoId !== item.videoId) ?? null
      );
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const categories = [
    ...new Set((history ?? []).map((item) => item.category ?? '미분류')),
  ].sort();

  const items = (history ?? [])
    .filter(
      (item) =>
        item.title
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()) &&
        (!category || (item.category ?? '미분류') === category) &&
        (filter !== 'favorite' || item.favorite) &&
        (filter !== 'difficult' || item.difficultCount > 0)
    )
    .sort((a, b) =>
      sort === 'title'
        ? a.title.localeCompare(b.title, 'ko')
        : Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
    );

  return (
    <section className={styles.root}>
      <h2>내 영상 목록</h2>
      <div className={styles.controls}>
        <label>
          제목 검색
          <input
            type='search'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='영상 제목으로 찾기'
          />
        </label>
        <label>
          카테고리
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}>
            <option value=''>전체 카테고리</option>
            {categories.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          정렬
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}>
            <option value='recent'>최근 활동순</option>
            <option value='title'>제목순</option>
          </select>
        </label>
      </div>
      <div
        className={styles.filters}
        role='group'
        aria-label='표시할 영상'>
        {[
          ['all', '모든 영상'],
          ['favorite', '관심 영상'],
          ['difficult', '안 들리는 구절이 있는 영상'],
        ].map(([value, label]) => (
          <Button
            key={value}
            variant='secondary'
            className={styles.filterButton}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}>
            {label}
          </Button>
        ))}
      </div>
      {history !== null && (
        <p
          className={styles.count}
          aria-live='polite'>
          {items.length}개 영상
        </p>
      )}
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}{' '}
          <Button
            variant='secondary'
            onClick={() => setReload((value) => value + 1)}>
            다시 불러오기
          </Button>
        </p>
      )}
      {history === null ? (
        error ? null : (
          <p role='status'>내 영상을 불러오는 중…</p>
        )
      ) : items.length === 0 ? (
        <p>
          조건에 맞는 영상이 없습니다. 검색 조건을 바꾸거나 영상을 추가해
          주세요.
        </p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li
              key={item.videoId}
              className={styles.item}>
              <div className={styles.titleRow}>
                <h3>
                  <Link href={videoPaths.lesson(item.videoId)}>
                    {item.title}
                  </Link>
                </h3>
                <span
                  className={
                    styles.status[
                      item.status === 'ready'
                        ? 'ready'
                        : item.status === 'failed'
                          ? 'failed'
                          : 'working'
                    ]
                  }>
                  {jobLabels[item.status]}
                </span>
              </div>
              <p className={styles.description}>
                {item.category ?? '미분류'} · 좋아요 {item.likeCount} · 안
                들리는 구절 {item.difficultCount}개
              </p>
              {item.count > 0 ? (
                <>
                  <div
                    className={styles.progress}
                    aria-hidden='true'>
                    <span
                      style={{
                        width: `${(Math.min(item.currentIndex, item.count) / item.count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className={styles.count}>
                    {Math.min(item.currentIndex, item.count)} / {item.count}{' '}
                    구절 진행
                  </span>
                </>
              ) : (
                <p className={styles.pending}>
                  {item.status === 'failed'
                    ? '영상에서 처리 상태를 확인해 주세요.'
                    : item.status === 'ready'
                      ? '학습할 구절이 없습니다. 영상에서 상태를 확인해 주세요.'
                      : '영상이 준비되면 학습을 시작할 수 있습니다.'}
                </p>
              )}
              <div className={styles.actions}>
                <Button
                  variant='secondary'
                  className={styles.actionButton}
                  aria-pressed={item.favorite}
                  disabled={busy !== null}
                  onClick={() => void favorite(item)}>
                  {item.favorite ? '관심 영상 해제' : '관심 영상으로 표시'}
                </Button>
                <Button
                  variant='secondary'
                  className={styles.removeButton}
                  disabled={busy !== null}
                  onClick={() => void remove(item)}>
                  내 목록에서 제거
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
