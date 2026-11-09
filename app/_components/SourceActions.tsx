'use client';
import { useState } from 'react';
import type { SourceInput } from '@/domains/materials/model/source';
import { Button } from '@/components/ui/primitives/Button';
import { Icon } from '@/components/ui/primitives/Icon';
import { ExpressionComposer } from './ExpressionComposer';
import { QuestionComposer } from './QuestionComposer';
import * as styles from '@/lib/styles/workspace.css';

/** PDF와 영상의 선택한 원문을 같은 저장·질문 흐름에 연결한다. */
export function SourceActions({
  source,
  language,
}: {
  source: SourceInput;
  language: 'en' | 'th';
}) {
  const [dialog, setDialog] = useState<'expression' | 'question' | null>(null);

  return (
    <>
      <div className={styles.row}>
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
    </>
  );
}
