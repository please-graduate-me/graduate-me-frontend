import { Banner } from '@/components/ui/composites/Banner';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Text } from '@/components/ui/primitives/Text';
import { Select } from '@/components/ui/primitives/Select';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/primitives/Button';
import { Icon } from '@/components/ui/primitives/Icon';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { listVideos } from '@/domains/videos/api/videos';
import type { VideoHistory } from '@/domains/videos/model/contracts';
import type { MaterialSummary } from '@/domains/materials/model/contracts';
import type { GrowthSummary } from '@/domains/growth/model/contracts';
import { MaterialGlyph } from './MaterialGlyph';
import { ResumeCard } from './ResumeCard';
import * as styles from './ResumeStack.css';

const recentLimit = 4;

/** 최근 PDF와 영상 중 고른 하나를 큰 이어서 학습 카드로, 나머지는 아래 타일 줄로 보여 준다. */
export function ResumeStack({
  materials,
  summaryLoading,
  growth,
}: {
  materials: MaterialSummary[];
  summaryLoading: boolean;
  growth: GrowthSummary | null;
}) {
  const [history, setHistory] = useState<VideoHistory | null>(null);
  const [language, setLanguage] = useState<'all' | 'en' | 'th'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

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

  const recent = [
    ...materials,
    ...(history ?? []).filter(
      (item) => item.status === 'ready' && item.count > 0
    ),
  ]
    .filter(
      (item) => language === 'all' || (item.language ?? 'en') === language
    )
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, recentLimit);

  const idOf = (item: (typeof recent)[number]) =>
    'videoId' in item ? item.videoId : item.id;

  // 언어를 바꿔 고른 자료가 목록에서 빠지면 가장 최근 자료로 돌아간다.
  const selected =
    recent.find((item) => idOf(item) === selectedId) ?? recent[0];

  const loading = (history === null && !error) || summaryLoading;

  return (
    <div className={styles.root}>
      <div className={styles.filter}>
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
      </div>
      {error && (
        <Banner
          status='error'
          icon='circle-alert'
          title='영상 자료를 불러오지 못했어요'
          role='alert'>
          <Text
            as='p'
            display='block'>
            {error}
          </Text>
          <Button
            variant='secondary'
            size='small'
            onClick={() => setReload((value) => value + 1)}>
            영상 목록 다시 불러오기
          </Button>
        </Banner>
      )}
      {selected ? (
        <>
          <ResumeCard
            item={selected}
            growth={growth}
          />
          <div
            role='group'
            aria-label='최근 자료'
            className={styles.tiles}>
            {recent.map((item) => (
              <Button
                key={idOf(item)}
                type='button'
                variant='secondary'
                shape='rounded'
                aria-label={item.title}
                title={item.title}
                aria-pressed={item === selected}
                className={styles.tile}
                onClick={() => setSelectedId(idOf(item))}>
                <MaterialGlyph kind={'videoId' in item ? 'video' : 'pdf'} />
              </Button>
            ))}
            <ButtonLink
              href='/materials?add=1'
              variant='dashed'
              shape='rounded'
              aria-label='자료 추가'
              className={styles.tile}>
              <Icon
                name='plus'
                size={22}
              />
            </ButtonLink>
          </div>
        </>
      ) : loading ? (
        <Text
          as='p'
          display='block'
          className={styles.loading}
          role='status'>
          최근 학습을 불러오고 있어요.
        </Text>
      ) : (
        <EmptyState
          title={
            language === 'all'
              ? '나의 첫 자료로 시작해 보세요'
              : '이 언어로 학습 중인 자료가 없어요'
          }
          description='PDF나 영상 링크를 추가하면 여기서 이어서 학습할 수 있어요.'>
          <ButtonLink
            href='/materials?add=1'
            startIcon='plus'>
            자료 추가
          </ButtonLink>
        </EmptyState>
      )}
    </div>
  );
}
