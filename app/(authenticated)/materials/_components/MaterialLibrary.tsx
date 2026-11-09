'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { MaterialSummary } from '@/domains/materials/model/contracts';
import type { VideoHistory } from '@/domains/videos/model/contracts';
import { listVideos } from '@/domains/videos/api/videos';
import { deleteMaterial } from '@/domains/materials/api/materials';
import { formatDate } from '@/domains/learning/lib/format';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { IconButton } from '@/components/ui/primitives/IconButton';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { MaterialRegistration } from './MaterialRegistration';
import * as styles from '@/lib/styles/workspace.css';

/** 실제 PDF와 기존 영상 등록 이력을 같은 자료 목록에서 탐색한다. */
export function MaterialLibrary({
  initial,
  initiallyAdding,
}: {
  initial: MaterialSummary[];
  initiallyAdding: boolean;
}) {
  const [materials, setMaterials] = useState(initial);
  const [videos, setVideos] = useState<VideoHistory>([]);
  const [kind, setKind] = useState<'all' | 'pdf' | 'video'>('all');
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(initiallyAdding);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void listVideos()
      .then((result) => {
        if (active) setVideos(result);
      })
      .catch((error) => {
        if (active) setError(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  async function remove(material: MaterialSummary) {
    if (
      !window.confirm(
        `‘${material.title}’ 원본 자료를 삭제할까요? 연결된 질문과 표현의 발췌는 보존됩니다.`
      )
    )
      return;
    setRemoving(material.id);
    setError('');

    try {
      await deleteMaterial(material.id);
      setMaterials((items) => items.filter((item) => item.id !== material.id));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setRemoving(null);
    }
  }

  const matching = (title: string) =>
    title.toLowerCase().includes(query.toLowerCase());

  const pdfs =
    kind === 'video' ? [] : materials.filter((item) => matching(item.title));

  const filteredVideos =
    kind === 'pdf' ? [] : videos.filter((item) => matching(item.title));

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>자료 보관함</h1>
          <p className={styles.description}>
            학습하고 싶은 PDF와 영상을 한곳에 모아 두세요.
          </p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <Icon
            name='plus'
            size={18}
          />
          자료 추가
        </Button>
      </div>
      <div className={styles.tabs}>
        {(
          [
            ['all', '전체'],
            ['pdf', 'PDF'],
            ['video', '영상'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type='button'
            className={styles.tab}
            aria-pressed={kind === value}
            onClick={() => setKind(value)}>
            {label}{' '}
            {value === 'all'
              ? materials.length + videos.length
              : value === 'pdf'
                ? materials.length
                : videos.length}
          </button>
        ))}
      </div>
      <div className={styles.filters}>
        <Input
          aria-label='자료 이름 검색'
          placeholder='자료 이름으로 찾기'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
      {!pdfs.length && !filteredVideos.length ? (
        <EmptyState
          icon='layers'
          title={query ? '검색한 자료가 없어요' : '학습할 자료를 추가해 보세요'}
          description={
            query
              ? '다른 이름으로 검색해 보세요.'
              : 'PDF 원문이나 YouTube 주소로 시작할 수 있어요.'
          }>
          <Button
            variant='secondary'
            onClick={() => setAdding(true)}>
            첫 자료 추가
          </Button>
        </EmptyState>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>자료</th>
              <th>종류 · 분량</th>
              <th>학습 위치</th>
              <th>상태</th>
              <th>최근 활동</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {pdfs.map((material) => (
              <tr key={material.id}>
                <td>
                  <div className={styles.row}>
                    <span className={styles.cover}>
                      <Icon name='file-text' />
                    </span>
                    <div>
                      <Link
                        className={styles.link}
                        href={`/materials/${encodeURIComponent(material.id)}`}>
                        {material.title}
                      </Link>
                      <p className={styles.meta}>
                        {material.language === 'en' ? '영어' : '태국어'} · 나만
                        보기
                      </p>
                    </div>
                  </div>
                </td>
                <td>PDF · {material.pageCount}페이지</td>
                <td>{material.currentPage}페이지</td>
                <td>
                  <Badge tone='success'>원본 준비 완료</Badge>
                </td>
                <td className={styles.meta}>
                  {formatDate(material.updatedAt)}
                </td>
                <td>
                  <IconButton
                    name='x'
                    label={`${material.title} 삭제`}
                    disabled={removing === material.id}
                    onClick={() => void remove(material)}
                  />
                </td>
              </tr>
            ))}
            {filteredVideos.map((video) => (
              <tr key={video.videoId}>
                <td>
                  <div className={styles.row}>
                    <span className={styles.cover}>
                      <Icon name='play' />
                    </span>
                    <div>
                      <Link
                        className={styles.link}
                        href={`/learn/${encodeURIComponent(video.videoId)}`}>
                        {video.title}
                      </Link>
                      <p className={styles.meta}>영어 · 영상 학습</p>
                    </div>
                  </div>
                </td>
                <td>영상 · {video.count}구절</td>
                <td>
                  {video.currentIndex} / {video.count}구절
                </td>
                <td>
                  <Badge
                    tone={
                      video.status === 'ready'
                        ? 'success'
                        : video.status === 'failed'
                          ? 'error'
                          : 'warning'
                    }>
                    {video.status === 'ready'
                      ? '학습 가능'
                      : video.status === 'failed'
                        ? '분석 실패'
                        : '자료 준비 중'}
                  </Badge>
                </td>
                <td className={styles.meta}>{formatDate(video.updatedAt)}</td>
                <td>
                  <Link
                    className={styles.link}
                    href={`/learn/${encodeURIComponent(video.videoId)}`}>
                    열기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {adding && <MaterialRegistration onClose={() => setAdding(false)} />}
    </div>
  );
}
