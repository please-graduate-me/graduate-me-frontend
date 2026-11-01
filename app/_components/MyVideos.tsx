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
    <section>
      <h2>내 영상</h2>
      <div className={styles.controls}>
        <label>
          제목 검색
          <input
            type='search'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='영상 제목'
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
          표시
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}>
            <option value='all'>모든 영상</option>
            <option value='favorite'>관심 영상</option>
            <option value='difficult'>안 들리는 구절이 있는 영상</option>
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
      {error && (
        <p role='alert'>
          {error}{' '}
          <Button
            variant='secondary'
            onClick={() => setReload((value) => value + 1)}>
            다시 불러오기
          </Button>
        </p>
      )}
      {history === null ? (
        <p role='status'>내 영상을 불러오는 중…</p>
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
              <Link href={videoPaths.lesson(item.videoId)}>{item.title}</Link>
              <p className={styles.description}>
                {jobLabels[item.status]} · {item.category ?? '미분류'} · 좋아요{' '}
                {item.likeCount} · 안 들리는 구절 {item.difficultCount}개
                {item.count > 0 &&
                  ` · ${Math.min(item.currentIndex, item.count)}/${item.count} 구절 진행`}
              </p>
              <div className={styles.controls}>
                <Button
                  variant='secondary'
                  aria-pressed={item.favorite}
                  disabled={busy !== null}
                  onClick={() => void favorite(item)}>
                  {item.favorite ? '관심 영상 해제' : '관심 영상으로 표시'}
                </Button>
                <Button
                  variant='secondary'
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
