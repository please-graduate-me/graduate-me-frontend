'use client';
import { useState } from 'react';
import { Heading } from '@/components/ui/primitives/Heading';
import { IconButton } from '@/components/ui/primitives/IconButton';
import { Text } from '@/components/ui/primitives/Text';
import {
  createExpression,
  deleteExpression,
} from '@/domains/expressions/api/expressions';
import type { Expression } from '@/domains/expressions/model/contracts';
import type { SourceInput } from '@/domains/materials/model/source';
import { expressionKey, type PdfVocabularyItem } from './pdfVocabulary';
import * as styles from './PdfKeyExpressions.css';

/** 현재 구절의 핵심 표현을 뜻과 함께 카드로 보여 주고 책갈피 버튼으로 표현집 저장을 바로 켜고 끈다. */
export function PdfKeyExpressions({
  words,
  expressions,
  source,
  onChanged,
  confirmRemove,
}: {
  words: PdfVocabularyItem[];
  expressions: Expression[];
  source: Extract<SourceInput, { kind: 'pdf' }>;
  onChanged: () => void;
  confirmRemove: (term: string) => Promise<boolean>;
}) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  if (!words.length) return null;

  // 다른 자료에서 저장한 같은 단어를 지우지 않도록 이 자료의 표현만 저장 상태로 본다.
  const savedFor = (word: PdfVocabularyItem) =>
    expressions.find(
      (item) =>
        item.source.kind === 'pdf' &&
        item.source.materialId === source.materialId &&
        expressionKey(item.text) === expressionKey(word.term)
    );

  async function toggle(word: PdfVocabularyItem) {
    if (busy) return;
    const saved = savedFor(word);

    if (saved && !(await confirmRemove(word.term))) return;
    setBusy(word.id);
    setError('');

    try {
      if (saved) await deleteExpression(saved.id);
      else
        await createExpression({
          // 선택 구절 안의 표현이면 그 위치를, 아니면 단어가 나온 쪽을 출처로 남긴다.
          source:
            word.page === source.page &&
            expressionKey(source.quote).includes(expressionKey(word.term))
              ? source
              : {
                  kind: 'pdf',
                  materialId: source.materialId,
                  page: word.page,
                  quote: word.term,
                  version: source.version,
                },
          text: word.term,
          meaning: word.meaning,
          kind: /\s/.test(word.term.trim()) ? 'phrase' : 'word',
        });
      onChanged();
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setBusy('');
    }
  }

  return (
    <section
      className={styles.root}
      aria-labelledby='pdf-key-expressions'>
      <Heading
        level={3}
        id='pdf-key-expressions'
        className={styles.heading}>
        핵심 표현
      </Heading>
      {error && (
        <Text
          as='p'
          display='block'
          type='supporting'
          role='alert'
          className={styles.error}>
          {error}
        </Text>
      )}
      <ul className={styles.list}>
        {words.map((word) => {
          const saved = Boolean(savedFor(word));

          return (
            <li
              key={word.id}
              className={styles.card}>
              <div className={styles.text}>
                <p className={styles.term}>
                  {word.term}{' '}
                  <span className={styles.partOfSpeech}>
                    {word.partOfSpeech}
                  </span>
                </p>
                <Text
                  as='p'
                  display='block'
                  type='supporting'>
                  {word.meaning}
                </Text>
              </div>
              <IconButton
                name='bookmark'
                label={`${word.term} 표현집에 저장`}
                size='medium'
                variant='outline'
                selected={saved}
                disabled={busy !== ''}
                className={styles.bookmark}
                onClick={() => void toggle(word)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
