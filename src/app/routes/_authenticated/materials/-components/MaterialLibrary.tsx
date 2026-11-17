import { AlertDialog } from '@/components/ui/composites/AlertDialog';
import { useConfirmation } from '@/lib/hooks/useConfirmation';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Select } from '@/components/ui/primitives/Select';
import { useEffect, useState } from 'react';
import type { MaterialSummary } from '@/domains/materials/model/contracts';
import type { VideoHistory } from '@/domains/videos/model/contracts';
import {
  listVideos,
  removeVideoFromLibrary,
  setVideoFavorite,
} from '@/domains/videos/api/videos';
import { deleteMaterial } from '@/domains/materials/api/materials';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { MaterialRegistration } from './MaterialRegistration';
import { MaterialSection } from './MaterialSection';
import { MaterialAddTile } from './MaterialAddTile';
import { PdfTile } from './PdfTile';
import { VideoTile } from './VideoTile';
import { CourseAssignmentSection } from './CourseAssignmentSection';
import { isPdfComplete } from './materialProgress';
import { useCourseAssignments } from './useCourseAssignments';
import * as styles from '@/lib/styles/workspace.css';
import * as libraryStyles from './MaterialLibrary.css';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../-components/SessionRecovery';

/** 실제 PDF, 영상 등록 이력, 수업 과제를 학습 중·과제·완료 묶음으로 나눠 탐색한다. */
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
  const [videoBusy, setVideoBusy] = useState<string | null>(null);
  const assignments = useCourseAssignments();

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

  async function favorite(video: VideoHistory[number]) {
    setVideoBusy(video.videoId);
    setError('');

    try {
      await setVideoFavorite(video.videoId, !video.favorite);

      setVideos((items) =>
        items.map((row) =>
          row.videoId === video.videoId
            ? { ...row, favorite: !video.favorite }
            : row
        )
      );
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setVideoBusy(null);
    }
  }

  async function removeVideo(video: VideoHistory[number]) {
    if (
      !(await confirmation.confirm(
        `‘${video.title}’ 영상을 내 목록에서 제거할까요? 학습 기록은 보존되고 같은 링크를 다시 추가하면 이어서 학습할 수 있어요.`
      ))
    )
      return;
    setVideoBusy(video.videoId);
    setError('');

    try {
      await removeVideoFromLibrary(video.videoId);

      setVideos((items) =>
        items.filter((row) => row.videoId !== video.videoId)
      );
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setVideoBusy(null);
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
  const learningPdfs = pdfs.filter((item) => !isPdfComplete(item));
  const completedPdfs = pdfs.filter(isPdfComplete);

  // 가장 최근에 손댄 학습 중 자료 하나에만 "이어서" 표지를 붙인다.
  const latest = [...learningPdfs, ...learningVideos].reduce<
    { id: string; time: number } | undefined
  >((best, item) => {
    const time = Date.parse(item.updatedAt);
    const id = 'videoId' in item ? item.videoId : item.id;

    return !best || time > best.time ? { id, time } : best;
  }, undefined)?.id;

  const courseSections = new Map<string, typeof assignments.items>();

  for (const item of assignments.items) {
    // 언어를 알 수 없는 수업(수업 목록 조회 실패)은 전체 언어에서만 보여 준다.
    if (
      (language === 'all' ||
        assignments.languages[item.courseId] === language) &&
      (kind === 'all' || item.source.kind === kind) &&
      (matching(item.title) || matching(item.source.title))
    )
      courseSections.set(item.courseId, [
        ...(courseSections.get(item.courseId) ?? []),
        item,
      ]);
  }

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
          size='comfortable'
          startIcon='plus'
          onClick={() => setAdding(true)}>
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
            className={libraryStyles.language}
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
      {!loading &&
      !pdfs.length &&
      !filteredVideos.length &&
      !courseSections.size ? (
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
            icon='trending-up'
            title='학습 중인 자료'
            description='PDF는 읽던 페이지, 영상은 저장한 위치에서 이어 가요'>
            {learningPdfs.map((material) => (
              <PdfTile
                key={material.id}
                material={material}
                isLatest={latest === material.id}
                removing={removing === material.id}
                onReplace={() => setReplacement(material)}
                onRemove={() => void remove(material)}
              />
            ))}
            {learningVideos.map((video) => (
              <VideoTile
                key={video.videoId}
                video={video}
                isLatest={latest === video.videoId}
                busy={videoBusy === video.videoId}
                onFavorite={() => void favorite(video)}
                onRemove={() => void removeVideo(video)}
              />
            ))}
            <MaterialAddTile onAdd={() => setAdding(true)} />
          </MaterialSection>
          {[...courseSections.values()].map((items) => (
            <CourseAssignmentSection
              key={items[0].courseId}
              courseId={items[0].courseId}
              courseTitle={items[0].courseTitle}
              assignments={items}
              now={assignments.loadedAt}
            />
          ))}
          {completedPdfs.length + completedVideos.length > 0 && (
            <MaterialSection
              icon='archive'
              tone='muted'
              title='완료한 자료'
              description='학습 기록과 표현은 그대로 남아 있어요'
              isCollapsible>
              {completedPdfs.map((material) => (
                <PdfTile
                  key={material.id}
                  material={material}
                  removing={removing === material.id}
                  onReplace={() => setReplacement(material)}
                  onRemove={() => void remove(material)}
                />
              ))}
              {completedVideos.map((video) => (
                <VideoTile
                  key={video.videoId}
                  video={video}
                  busy={videoBusy === video.videoId}
                  onFavorite={() => void favorite(video)}
                  onRemove={() => void removeVideo(video)}
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
