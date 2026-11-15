'use client';
import { Button } from '@/components/ui/primitives/Button';
import { Text } from '@/components/ui/primitives/Text';
import type { SourceInput } from '@/domains/materials/model/source';
import { SessionRecovery } from '../../../../_components/SessionRecovery';
import { usePassageTranslation } from './usePassageTranslation';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import * as styles from './PdfPassageCard.css';

/** 선택한 구절을 크림색 카드에 담고 저장 번역, 요청형 번역 보기, 문장 듣기를 함께 둔다. */
export function PdfPassageCard({
  source,
  language,
  allowGeneration,
  onTranslated,
}: {
  source: Extract<SourceInput, { kind: 'pdf' }>;
  language: 'en' | 'th';
  allowGeneration: boolean;
  onTranslated?: () => void;
}) {
  const passage = usePassageTranslation(source, onTranslated);
  const speech = useSpeechSynthesis(language);

  return (
    <div className={styles.root}>
      {passage.sessionExpired && <SessionRecovery />}
      <Text
        as='p'
        display='block'
        type='supporting'
        weight='semibold'
        className={styles.meta}>
        PDF · {source.page}페이지 · 원본 v{source.version ?? 1}
        {source.ocrId ? ' · OCR' : ''}
      </Text>
      <p
        className={styles.quote}
        lang={language}>
        {source.quote}
      </p>
      {passage.translation ? (
        <Text
          as='p'
          display='block'
          type='supporting'
          className={styles.translation}>
          {passage.translation}
        </Text>
      ) : (
        passage.loading && (
          <Text
            as='p'
            display='block'
            type='supporting'
            role='status'>
            저장된 번역을 확인하고 있어요.
          </Text>
        )
      )}
      {passage.error && (
        <Text
          as='p'
          display='block'
          type='supporting'
          role='alert'
          className={styles.error}>
          {passage.error}
        </Text>
      )}
      <div className={styles.actions}>
        {!passage.translation && !passage.loading && (
          <Button
            type='button'
            variant='secondary'
            size='small'
            startIcon='globe'
            loading={passage.busy}
            disabled={passage.busy || !allowGeneration}
            onClick={() => void passage.request()}>
            번역 보기
          </Button>
        )}
        {speech.supported && (
          <Button
            type='button'
            variant='secondary'
            size='small'
            startIcon={speech.speaking ? 'pause' : 'volume-2'}
            aria-pressed={speech.speaking}
            onClick={() =>
              speech.speaking ? speech.stop() : speech.speak(source.quote)
            }>
            문장 듣기
          </Button>
        )}
      </div>
    </div>
  );
}
