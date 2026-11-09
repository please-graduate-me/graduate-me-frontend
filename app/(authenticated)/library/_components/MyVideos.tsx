'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/primitives/Button';
import { Icon } from '@/components/ui/primitives/Icon';
import { Badge } from '@/components/ui/primitives/Badge';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Dialog } from '@/components/ui/composites/Dialog';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import {
  listVideos,
  removeVideoFromLibrary,
  setVideoFavorite,
} from '@/domains/videos/api/videos';
import type { VideoHistory } from '@/domains/videos/model/contracts';
import type { MaterialSummary } from '@/domains/materials/model/contracts';
import { videoPaths } from '@/domains/videos/config/paths';
import { materialPaths } from '@/domains/materials/config/paths';
import { jobLabels } from '@/domains/videos/config/catalog';
import { formatDate } from '@/domains/learning/lib/format';
import { ResumeCard } from './ResumeCard';
import * as styles from './MyVideos.css';

/** 기존 영상 목록 동작과 PDF의 최근 학습을 하나의 실제 자료 목록으로 보여 준다. */
export function MyVideos({
  materials,
  materialCount,
  summaryLoading,
}: {
  materials: MaterialSummary[];
  materialCount: number;
  summaryLoading: boolean;
}) {
  const [history, setHistory] = useState<VideoHistory | null>(null);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pdf' | 'video'>('all');
  const [removing, setRemoving] = useState<VideoHistory[number] | null>(null);

  useEffect(() => {
    let disposed = false;

    listVideos()
      .then((items) => {
        if (!disposed) {
          setHistory(items);
          setError('');
        }
      })
      .catch((error: Error) => {
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

  async function remove() {
    if (!removing) return;
    setBusy(removing.videoId);
    setError('');

    try {
      await removeVideoFromLibrary(removing.videoId);

      setHistory(
        (items) =>
          items?.filter((row) => row.videoId !== removing.videoId) ?? null
      );

      setRemoving(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const videos = history ?? [];

  const recent = [
    ...materials,
    ...videos.filter((item) => item.status === 'ready' && item.count > 0),
  ]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, 2);

  const items = [
    ...(filter !== 'video' ? materials : []),
    ...(filter !== 'pdf' ? videos : []),
  ]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, 4);

  const loading = (history === null && !error) || summaryLoading;

  return (
    <>
      <section
        className={styles.root}
        aria-labelledby='resume-title'>
        <h2 id='resume-title'>이어서 학습하기</h2>
        {recent.length > 0 ? (
          <div className={styles.resume}>
            {recent.map((item) => (
              <ResumeCard
                key={'videoId' in item ? item.videoId : item.id}
                item={item}
              />
            ))}
          </div>
        ) : loading ? (
          <p
            className={styles.loading}
            role='status'>
            최근 학습을 불러오고 있어요.
          </p>
        ) : (
          <div className={styles.empty}>
            <EmptyState
              title='나의 첫 자료로 시작해 보세요'
              description='PDF나 영상 링크를 추가하면 여기서 이어서 학습할 수 있어요.'>
              <ButtonLink href='/materials?add=1'>
                <Icon
                  name='plus'
                  size={16}
                />
                자료 추가
              </ButtonLink>
            </EmptyState>
          </div>
        )}
      </section>
      <section
        className={styles.root}
        aria-labelledby='recent-materials-title'>
        <div className={styles.heading}>
          <h2 id='recent-materials-title'>최근 자료</h2>
          <Link href='/materials'>전체 보기</Link>
        </div>
        <div
          className={styles.tabs}
          role='group'
          aria-label='자료 종류'>
          {(
            [
              ['all', '전체', materialCount + videos.length],
              ['pdf', 'PDF', materialCount],
              ['video', '영상', videos.length],
            ] as const
          ).map(([value, label, count]) => (
            <button
              key={value}
              type='button'
              className={styles.tab}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}>
              {label}
              {!loading && <span>{count}</span>}
            </button>
          ))}
        </div>
        {error && (
          <div
            className={styles.error}
            role='alert'>
            <p>{error}</p>
            <Button
              variant='secondary'
              size='small'
              onClick={() => setReload((value) => value + 1)}>
              영상 목록 다시 불러오기
            </Button>
          </div>
        )}
        {items.length > 0 ? (
          <ul className={styles.list}>
            {items.map((item) => {
              const video = 'videoId' in item;
              const id = video ? item.videoId : item.id;

              const href = video
                ? videoPaths.lesson(item.videoId)
                : materialPaths.detail(item.id, item.currentPage);

              return (
                <li
                  key={id}
                  className={styles.item}>
                  <span
                    className={styles.fileType}
                    data-kind={video ? 'video' : 'pdf'}>
                    <Icon
                      name={video ? 'play' : 'file-text'}
                      size={18}
                    />
                  </span>
                  <div className={styles.information}>
                    <h3>
                      <Link href={href}>{item.title}</Link>
                    </h3>
                    <p>
                      {video
                        ? (item.language === 'th' ? '태국어' : '영어') +
                          ' · 영상 · 정답 구절 ' +
                          Math.min(item.completedCount ?? 0, item.count) +
                          ' / ' +
                          item.count
                        : (item.language === 'th' ? '태국어' : '영어') +
                          ' · 읽기 자료 · ' +
                          item.pageCount +
                          '페이지'}
                    </p>
                    {video && item.status !== 'ready' && (
                      <Badge
                        tone={item.status === 'failed' ? 'error' : 'warning'}>
                        {jobLabels[item.status] ?? item.status}
                      </Badge>
                    )}
                  </div>
                  <time
                    className={styles.updated}
                    dateTime={item.updatedAt}>
                    {formatDate(item.updatedAt)}
                  </time>
                  {video ? (
                    <details className={styles.menu}>
                      <summary aria-label={item.title + ' 관리'}>
                        <Icon
                          name='ellipsis'
                          size={18}
                        />
                      </summary>
                      <div className={styles.menuContent}>
                        <button
                          type='button'
                          disabled={busy !== null}
                          onClick={() => void favorite(item)}>
                          <Icon
                            name='bookmark'
                            size={16}
                          />
                          {item.favorite ? '관심 해제' : '관심 영상으로 저장'}
                        </button>
                        <button
                          type='button'
                          disabled={busy !== null}
                          onClick={() => setRemoving(item)}>
                          <Icon
                            name='x'
                            size={16}
                          />
                          내 목록에서 제거
                        </button>
                      </div>
                    </details>
                  ) : (
                    <Link
                      href={href}
                      className={styles.open}
                      aria-label={item.title + ' 열기'}>
                      <Icon
                        name='arrow-up-right'
                        size={18}
                      />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        ) : loading ? (
          <p
            className={styles.loading}
            role='status'>
            자료를 불러오고 있어요.
          </p>
        ) : (
          <EmptyState
            title='이 종류의 자료가 아직 없어요'
            description='새 자료를 추가하거나 다른 종류의 자료를 선택해 보세요.'
          />
        )}
        <p className={styles.listNote}>
          최근 활동한 자료를 최대 4개까지 보여 드려요.
        </p>
      </section>
      <Dialog
        open={removing !== null}
        onClose={() => {
          if (busy === null) setRemoving(null);
        }}
        title='내 영상 목록에서 제거할까요?'
        description='학습 기록은 보존됩니다. 같은 영상 링크를 다시 추가하면 이어서 학습할 수 있어요.'
        footer={
          <>
            <Button
              variant='secondary'
              disabled={busy !== null}
              onClick={() => setRemoving(null)}>
              취소
            </Button>
            <Button
              variant='danger'
              loading={busy !== null}
              onClick={() => void remove()}>
              목록에서 제거
            </Button>
          </>
        }>
        <p className={styles.removalTitle}>{removing?.title}</p>
      </Dialog>
    </>
  );
}
