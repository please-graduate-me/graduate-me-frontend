'use client';
import { Card } from '@/components/ui/primitives/Card';

import { List } from '@/components/ui/composites/List';
import { ListItem } from '@/components/ui/composites/ListItem';

import { Blockquote } from '@/components/ui/primitives/Blockquote';
import { Banner } from '@/components/ui/composites/Banner';
import { Text } from '@/components/ui/primitives/Text';
import { Section } from '@/components/ui/layouts/Section';
import { Heading } from '@/components/ui/primitives/Heading';
import { ProgressBar } from '@/components/ui/primitives/ProgressBar';
import { Collapsible } from '@/components/ui/composites/Collapsible';
import { useEffect, useRef, useState } from 'react';
import {
  getMaterialAnalysis,
  retryMaterialAnalysis,
} from '@/domains/materials/api/analysis';
import type { MaterialAnalysisResponse } from '@/domains/materials/model/analysis';
import { ApiError } from '@/lib/api/request';
import { Button } from '@/components/ui/primitives/Button';
import { SessionRecovery } from '../../../../_components/SessionRecovery';
import * as styles from '@/lib/styles/workspace.css';
import * as analysisStyles from './MaterialAnalysisPanel.css';

const statusLabel = {
  queued: '정리를 기다리고 있어요',
  running: 'PDF 전체를 정리하고 있어요',
  ready: '전체 정리가 완료됐어요',
  partial: '일부 페이지의 정리가 남아 있어요',
  failed: '자료 정리를 완료하지 못했어요',
  skipped: '전체 자동 정리 범위를 초과했어요',
};

/** 자료를 다시 열어도 저장 분석을 복원하고 진행 중일 때만 상태를 갱신한다. */
export function MaterialAnalysisPanel({
  materialId,
  version,
  owned,
  pageCount,
  onPage,
}: {
  materialId: string;
  version: number;
  owned: boolean;
  pageCount: number;
  onPage: (page: number) => void;
}) {
  const [value, setValue] =
    useState<MaterialAnalysisResponse['analysis']>(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const requestId = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function load() {
      try {
        const result = await getMaterialAnalysis(materialId, version);

        if (!active) return;
        setValue(result.analysis);
        setError('');
        setLoading(false);
        if (
          result.analysis &&
          ['queued', 'running'].includes(result.analysis.status)
        )
          timer = setTimeout(() => void load(), 5000);
      } catch (failure) {
        if (!active) return;
        setLoading(false);
        setError((failure as Error).message);

        setSessionExpired(
          failure instanceof ApiError && failure.status === 401
        );
      }
    }

    void load();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [materialId, version, refresh]);

  async function retry() {
    if (busy) return;
    setBusy(true);
    setError('');
    setSessionExpired(false);
    requestId.current ??= crypto.randomUUID();

    try {
      const result = await retryMaterialAnalysis(
        materialId,
        version,
        requestId.current
      );

      setValue(result.analysis);
      requestId.current = null;
      setRefresh((count) => count + 1);
    } catch (failure) {
      setError((failure as Error).message);
      setSessionExpired(failure instanceof ApiError && failure.status === 401);
      if (failure instanceof ApiError && ![0, 409].includes(failure.status))
        requestId.current = null;
    } finally {
      setBusy(false);
    }
  }

  const working = value && ['queued', 'running'].includes(value.status);

  return (
    <div className={styles.stack}>
      {sessionExpired && <SessionRecovery />}
      {loading && (
        <Text
          as='p'
          display='block'
          role='status'>
          저장된 문서 정리를 확인하고 있어요.
        </Text>
      )}
      {error && (
        <div role='alert'>
          <Banner
            status='error'
            title='확인이 필요해요'>
            {error}
          </Banner>
          <Button
            variant='ghost'
            onClick={() => setRefresh((count) => count + 1)}>
            결과 다시 조회
          </Button>
        </div>
      )}
      {value && (
        <Card
          variant='muted'
          className={styles.sourcePanel}
          aria-live='polite'>
          <Heading level={3}>{statusLabel[value.status]}</Heading>
          <Text
            as='p'
            display='block'>
            원본 v{value.version} ·{' '}
            {
              { ko: '한국어', en: '영어', th: '태국어' }[
                value.explanationLanguage
              ]
            }{' '}
            정리
          </Text>
          {value.totalPages > 0 && (
            <>
              <ProgressBar
                label='진행 상황'
                isLabelHidden
                className={analysisStyles.progress}
                max={value.totalPages}
                value={value.completedPages}
                aria-label='문서 정리 진행률'
              />
              <Text
                as='p'
                display='block'>
                {value.completedPages} / {value.totalPages}페이지 완료
              </Text>
            </>
          )}
          {working && (
            <Text
              as='p'
              display='block'
              className={styles.description}>
              이 화면을 닫아도 정리는 계속됩니다. 완료된 페이지부터 아래에서
              읽을 수 있어요.
            </Text>
          )}
          {value.error && (
            <Text
              as='p'
              display='block'
              role='status'>
              {value.error}
            </Text>
          )}
          {value.status === 'partial' && (
            <Text
              as='p'
              display='block'>
              아래 소개와 요약은 완료된 페이지를 기준으로 한 중간 결과입니다.
            </Text>
          )}
          <Text
            as='p'
            display='block'
            className={styles.meta}>
            AI가 생성한 정리입니다. 원본과 함께 확인해 주세요.
          </Text>
        </Card>
      )}
      {!loading && !value && !error && (
        <Text
          as='p'
          display='block'>
          이 원본 버전에는 저장된 전체 정리가 없습니다.{' '}
          {pageCount > 30
            ? '전체 정리는 최대 30페이지까지 지원합니다.'
            : '자료 소개·전체 번역·핵심 단어·요약을 준비할 수 있어요.'}
        </Text>
      )}
      {owned && pageCount <= 30 && !loading && (!value || value.canRetry) && (
        <div>
          <Button
            loading={busy}
            disabled={busy}
            onClick={() => void retry()}>
            {value ? '남은 페이지 정리 다시 요청' : '전체 정리 시작'}
          </Button>
          <Text
            as='p'
            display='block'
            className={styles.meta}>
            완료된 페이지는 보존하며, 새 분석은 AI 사용 한도를 소모합니다.
          </Text>
        </div>
      )}
      {value?.overview && (
        <>
          <Section>
            <Heading level={3}>어떤 자료인가요?</Heading>
            <Text
              as='p'
              display='block'
              className={styles.meta}>
              {value.overview.documentType}
            </Text>
            <Text
              as='p'
              display='block'
              className={analysisStyles.text}>
              {value.overview.introduction}
            </Text>
          </Section>
          <Section>
            <Heading level={3}>핵심 요약</Heading>
            <List className={analysisStyles.list}>
              {value.overview.summary.map((text, index) => (
                <ListItem
                  key={index}
                  label={<>{text}</>}
                />
              ))}
            </List>
            {value.overview.keyPoints.map((point, index) => (
              <div key={index}>
                <Text
                  as='p'
                  display='block'>
                  {point.text}
                </Text>
                <div className={styles.row}>
                  {point.pages.map((page) => (
                    <Button
                      key={page}
                      size='small'
                      variant='ghost'
                      onClick={() => onPage(page)}>
                      {page}페이지 원문
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </Section>
          <Collapsible
            defaultIsOpen
            trigger={<>핵심 단어·표현 {value.overview.vocabulary.length}개</>}>
            <dl className={analysisStyles.words}>
              {value.overview.vocabulary.map((word) => (
                <div
                  key={word.id}
                  className={analysisStyles.word}>
                  <dt>
                    <strong className={analysisStyles.term}>{word.term}</strong>{' '}
                    <span className={styles.meta}>
                      {word.lemma} · {word.partOfSpeech}
                    </span>
                  </dt>
                  <dd>
                    <Text
                      as='p'
                      display='block'>
                      {word.meaning}
                    </Text>
                    <Blockquote>{word.example}</Blockquote>
                    <Button
                      size='small'
                      variant='ghost'
                      onClick={() => onPage(word.page)}>
                      {word.page}페이지 원문 보기
                    </Button>
                  </dd>
                </div>
              ))}
            </dl>
          </Collapsible>
        </>
      )}
      {value && value.pages.length > 0 && (
        <Section>
          <Heading level={3}>페이지별 전체 번역</Heading>
          <Text
            as='p'
            display='block'
            className={styles.description}>
            문제집의 정답·해설이 포함될 수 있습니다. 확인할 페이지를 펼쳐
            주세요.
          </Text>
          {value.pages.map((page) => (
            <Collapsible
              key={page.page}
              className={analysisStyles.translation}
              trigger={
                <>
                  {page.page}페이지 ·{' '}
                  {page.status === 'ready'
                    ? '번역 완료'
                    : page.status === 'failed'
                      ? '정리 실패'
                      : '대기 중'}
                </>
              }>
              <Button
                size='small'
                variant='ghost'
                onClick={() => onPage(page.page)}>
                원본 페이지 보기
              </Button>
              {page.error && (
                <Banner
                  status='error'
                  title='확인이 필요해요'>
                  {page.error}
                </Banner>
              )}
              {page.translation !== null && (
                <Text
                  as='p'
                  display='block'
                  className={analysisStyles.text}>
                  {page.translation || '번역할 텍스트가 없는 페이지입니다.'}
                </Text>
              )}
              {page.warnings.map((warning, index) => (
                <Banner
                  status='info'
                  title='안내'
                  key={index}>
                  {warning}
                </Banner>
              ))}
            </Collapsible>
          ))}
        </Section>
      )}
    </div>
  );
}
