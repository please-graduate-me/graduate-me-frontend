'use client';
import { AlertDialog } from '@astryxdesign/core/AlertDialog';
import { useConfirmation } from '@/lib/hooks/useConfirmation';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Banner } from '@astryxdesign/core/Banner';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Select } from '@/components/ui/primitives/Select';
import { useEffect, useState } from 'react';
import type { MaterialSummary } from '@/domains/materials/model/contracts';
import type { VideoHistory } from '@/domains/videos/model/contracts';
import { listVideos } from '@/domains/videos/api/videos';
import { deleteMaterial } from '@/domains/materials/api/materials';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Icon } from '@/components/ui/primitives/Icon';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { MaterialRegistration } from './MaterialRegistration';
import { MaterialSection } from './MaterialSection';
import { MaterialAddTile } from './MaterialAddTile';
import { PdfTile } from './PdfTile';
import { VideoTile } from './VideoTile';
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
  const confirmation = useConfirmation();
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
      !(await confirmation.confirm(
        `‘${material.title}’ 원본 자료를 삭제할까요? 연결된 질문과 표현의 발췌는 보존됩니다.`
      ))
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

  const learningVideos = filteredVideos.filter((item) => !item.isComplete);
  const completedVideos = filteredVideos.filter((item) => item.isComplete);

  return (
    <div className={libraryStyles.root}>
      <AlertDialog {...confirmation.dialog} />
      <div className={libraryStyles.header}>
        <div>
          <Heading level={1}>자료 보관함</Heading>
          <Text
            as='p'
            display='block'
            className={styles.description}>
            학습하고 싶은 PDF와 영상을 한곳에 모아 두세요.
          </Text>
        </div>
        <Button
          variant='ink'
          onClick={() => setAdding(true)}>
          <Icon
            name='plus'
            size={18}
          />
          자료 추가
        </Button>
      </div>
      <div className={libraryStyles.toolbar}>
        <div className={libraryStyles.tabs}>
          {(
            [
              ['all', '전체'],
              ['pdf', 'PDF'],
              ['video', '영상'],
            ] as const
          ).map(([value, label]) => (
            <Button
              variant='secondary'
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
            </Button>
          ))}
        </div>
        <div className={libraryStyles.filters}>
          <Select
            label={contentLabel(<>학습 언어 </>)}
            aria-label='학습 언어 필터'
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as typeof language)
            }>
            <option value='all'>모든 언어</option>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
          <Input
            aria-label='자료 이름 검색'
            placeholder='자료 이름으로 찾기'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      {sessionExpired && <SessionRecovery />}
      {error && (
        <Banner
          status='error'
          title='확인이 필요해요'
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
        </Banner>
      )}
      {loading && (
        <Text
          as='p'
          display='block'
          className={styles.meta}
          role='status'>
          저장된 영상 목록을 불러오고 있어요.
        </Text>
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
        <div
          role='group'
          aria-label='내 PDF와 영상 자료'
          className={libraryStyles.sections}>
          <MaterialSection
            icon='chart-no-axes-column'
            title='학습 중인 자료'
            description='PDF는 읽던 페이지, 영상은 저장한 위치에서 이어 가요'>
            {pdfs.map((material) => (
              <PdfTile
                key={material.id}
                material={material}
                removing={removing === material.id}
                onReplace={() => setReplacement(material)}
                onRemove={() => void remove(material)}
              />
            ))}
            {learningVideos.map((video) => (
              <VideoTile
                key={video.videoId}
                video={video}
              />
            ))}
            <MaterialAddTile onAdd={() => setAdding(true)} />
          </MaterialSection>
          {completedVideos.length > 0 && (
            <MaterialSection
              icon='check-check'
              tone='muted'
              title='완료한 자료'
              description='학습 기록과 표현은 그대로 남아 있어요'>
              {completedVideos.map((video) => (
                <VideoTile
                  key={video.videoId}
                  video={video}
                />
              ))}
            </MaterialSection>
          )}
        </div>
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
