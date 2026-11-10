'use client';
import { useState } from 'react';
import type { SourceInput } from '@/domains/materials/model/source';
import { Button } from '@/components/ui/primitives/Button';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Icon } from '@/components/ui/primitives/Icon';
import { ExpressionComposer } from './ExpressionComposer';
import { QuestionComposer } from './QuestionComposer';
import { LearningAiPanel } from './LearningAiPanel';
import { AnnotationComposer } from './AnnotationComposer';
import { VideoAnnotations } from './VideoAnnotations';
import { ExcerptShareComposer } from './ExcerptShareComposer';
import type { Annotation } from '@/domains/materials/model/records';
import * as styles from '@/lib/styles/workspace.css';

/** PDF와 영상의 선택한 원문을 같은 저장·질문 흐름에 연결한다. */
export function SourceActions({
  source,
  language,
  onAnnotated,
  image,
}: {
  source: SourceInput;
  language: 'en' | 'th';
  onAnnotated?: (value: Annotation) => void;
  image?: { base64: string; mimeType: 'image/png' | 'image/jpeg' };
}) {
  const [dialog, setDialog] = useState<
    'expression' | 'question' | 'annotation' | 'share' | 'report' | null
  >(null);

  const [aiOpen, setAiOpen] = useState(false);
  const [annotationReload, setAnnotationReload] = useState(0);

  return (
    <>
      <div className={styles.row}>
        <Button
          variant='secondary'
          size='small'
          aria-expanded={aiOpen}
          onClick={() => setAiOpen((value) => !value)}>
          <Icon
            name='sparkles'
            size={16}
          />
          {aiOpen ? 'AI 패널 닫기' : '뜻·번역·AI에게 질문'}
        </Button>
        <Button
          variant='secondary'
          size='small'
          onClick={() => setDialog('expression')}>
          <Icon
            name='bookmark'
            size={16}
          />
          표현 저장
        </Button>
        <Button
          variant='ghost'
          size='small'
          onClick={() => setDialog('question')}>
          <Icon
            name='message-circle'
            size={16}
          />
          도우미에게 질문
        </Button>
      </div>
      <div className={styles.row}>
        <Button
          size='small'
          variant='ghost'
          onClick={() => setDialog('annotation')}>
          하이라이트·메모
        </Button>
        <Button
          size='small'
          variant='ghost'
          onClick={() => setDialog('share')}>
          발췌 공유
        </Button>
        <ButtonLink
          variant='ghost'
          size='small'
          href={`/community?source=${encodeURIComponent(JSON.stringify(source))}&language=${language}`}>
          일반 글로 발췌 공유
        </ButtonLink>
        <Button
          size='small'
          variant='ghost'
          onClick={() => setDialog('report')}>
          원문 오류 신고
        </Button>
      </div>
      {source.kind === 'video' && (
        <VideoAnnotations
          source={source}
          reload={annotationReload}
        />
      )}
      {aiOpen && (
        <LearningAiPanel
          key={JSON.stringify(source)}
          source={source}
          language={language}
          image={image}
        />
      )}
      {dialog === 'expression' && (
        <ExpressionComposer
          source={source}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'question' && (
        <QuestionComposer
          source={source}
          language={language}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'report' && (
        <QuestionComposer
          source={source}
          language={language}
          report
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'annotation' && (
        <AnnotationComposer
          source={source}
          onSaved={(value) => {
            onAnnotated?.(value);
            setAnnotationReload((previous) => previous + 1);
          }}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'share' && (
        <ExcerptShareComposer
          source={source}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
}
