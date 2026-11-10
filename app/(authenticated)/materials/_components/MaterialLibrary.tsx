'use client';
import { Select } from '@/components/ui/primitives/Select';
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
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { MaterialRegistration } from './MaterialRegistration';
import * as styles from '@/lib/styles/workspace.css';
import * as libraryStyles from './MaterialLibrary.css';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';

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
  const [language, setLanguage] = useState<'all' | 'en' | 'th'>('all');
  const [adding, setAdding] = useState(initiallyAdding);

  const [replacement, setReplacement] = useState<MaterialSummary | undefined>(
    undefined
  );

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void listVideos()
      .then((result) => {
        if (active) {
          setVideos(result);
          setError('');
          setLoading(false);
        }
      })
      .catch((error) => {
        if (active) {
          setSessionExpired(error instanceof ApiError && error.status === 401);
          setError(error.message);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [reload]);

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
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setRemoving(null);
    }
  }

  const matching = (title: string) =>
    title.toLowerCase().includes(query.toLowerCase());

  const pdfs =
    kind === 'video'
      ? []
      : materials.filter(
          (item) =>
            matching(item.title) &&
            (language === 'all' || item.language === language)
        );

  const filteredVideos =
    kind === 'pdf'
      ? []
      : videos.filter(
          (item) =>
            matching(item.title) &&
            (language === 'all' || (item.language ?? 'en') === language)
        );

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
        <label>
          학습 언어{' '}
          <Select
            aria-label='학습 언어 필터'
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as typeof language)
            }>
            <option value='all'>모든 언어</option>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
        </label>
        <Input
          aria-label='자료 이름 검색'
          placeholder='자료 이름으로 찾기'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {sessionExpired && <SessionRecovery />}
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
          <Button
            variant='ghost'
            size='small'
            onClick={() => {
              setLoading(true);
              setReload((value) => value + 1);
            }}>
            영상 목록 다시 조회
          </Button>
        </p>
      )}
      {loading && (
        <p
          className={styles.meta}
          role='status'>
          저장된 영상 목록을 불러오고 있어요.
        </p>
      )}
      {!loading && !pdfs.length && !filteredVideos.length ? (
        <EmptyState
          icon='layers'
          title={
            query || language !== 'all' || kind !== 'all'
              ? '이 조건의 자료가 없어요'
              : '학습할 자료를 추가해 보세요'
          }
          description='PDF 원문이나 공개 YouTube 주소로 시작할 수 있습니다.'>
          <div className={styles.row}>
            <Button
              variant='secondary'
              onClick={() => {
                setKind('all');
                setLanguage('all');
                setQuery('');
              }}>
              전체 자료 보기
            </Button>
            <Button onClick={() => setAdding(true)}>자료 추가</Button>
          </div>
        </EmptyState>
      ) : (
        <ul
          className={libraryStyles.list}
          aria-label='내 PDF와 영상 자료'>
          {pdfs.map((material) => (
            <li
              key={material.id}
              className={libraryStyles.row}>
              <span
                className={libraryStyles.cover}
                data-kind='pdf'>
                <Icon
                  name='file-text'
                  size={18}
                />
              </span>
              <div className={libraryStyles.info}>
                <Link
                  className={styles.link}
                  href={`/materials/${encodeURIComponent(material.id)}`}>
                  {material.title}
                </Link>
                <p className={styles.meta}>
                  {material.language === 'en' ? '영어' : '태국어'} · 읽기 자료 ·{' '}
                  {material.pageCount}페이지 · 원본 v{material.version ?? 1}
                </p>
                <span className={styles.meta}>
                  {material.visibility === 'public'
                    ? '공개 자료'
                    : material.visibility === 'accounts'
                      ? '지정 계정 공유'
                      : '나만 보기'}{' '}
                  · {material.currentPage}페이지에서 이어 읽기
                </span>
              </div>
              <span className={libraryStyles.status}>
                <Badge tone='success'>원본 준비 완료</Badge>
                <time className={styles.meta}>
                  {formatDate(material.updatedAt)}
                </time>
              </span>
              {material.owned && (
                <details className={libraryStyles.menu}>
                  <summary aria-label={`${material.title} 관리`}>
                    <Icon
                      name='ellipsis'
                      size={16}
                    />
                  </summary>
                  <div className={libraryStyles.actions}>
                    <Button
                      variant='ghost'
                      size='small'
                      onClick={() => setReplacement(material)}>
                      새 원본 버전 등록
                    </Button>
                    <Button
                      variant='danger'
                      size='small'
                      disabled={removing === material.id}
                      onClick={() => void remove(material)}>
                      내 PDF 삭제
                    </Button>
                  </div>
                </details>
              )}
            </li>
          ))}
          {filteredVideos.map((video) => (
            <li
              key={video.videoId}
              className={libraryStyles.row}>
              <span
                className={libraryStyles.cover}
                data-kind='video'>
                <Icon
                  name='play'
                  size={18}
                />
              </span>
              <div className={libraryStyles.info}>
                <Link
                  className={styles.link}
                  href={`/learn/${encodeURIComponent(video.videoId)}`}>
                  {video.title}
                </Link>
                <p className={styles.meta}>
                  {video.language === 'th' ? '태국어' : '영어'} · 영상 · 정답
                  구절 {video.completedCount ?? 0} / {video.count}
                </p>
                <span className={styles.meta}>
                  {video.isComplete
                    ? '모든 학습 구절 정답 통과'
                    : '저장한 위치에서 이어 학습'}
                </span>
              </div>
              <span className={libraryStyles.status}>
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
                <time className={styles.meta}>
                  {formatDate(video.updatedAt)}
                </time>
              </span>
              <Link
                href={`/learn/${encodeURIComponent(video.videoId)}`}
                className={styles.link}
                aria-label={`${video.title} 열기`}>
                <Icon
                  name='arrow-up-right'
                  size={18}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {adding && <MaterialRegistration onClose={() => setAdding(false)} />}
      {replacement && (
        <MaterialRegistration
          replacement={replacement}
          onClose={() => setReplacement(undefined)}
        />
      )}
    </div>
  );
}
