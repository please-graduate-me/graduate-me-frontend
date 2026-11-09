'use client';
import { useEffect, useRef, useState } from 'react';
import {
  getMaterialOcr,
  recognizeMaterialPage,
} from '@/domains/materials/api/ocr';
import type { MaterialOcr, OcrPage } from '@/domains/materials/model/ocr';
import { ApiError } from '@/lib/api/request';
import { Button } from '@/components/ui/primitives/Button';
import { Badge } from '@/components/ui/primitives/Badge';
import { SessionRecovery } from '../../../../_components/SessionRecovery';
import * as styles from '@/lib/styles/workspace.css';

/** 저장 결과 조회와 소유자의 명시적 한 페이지 인식을 구분한다. */
export function PdfOcrPanel({
  id,
  version,
  page,
  owned,
  historical,
  usingOcr,
  hasNativeText,
  onResult,
  onMode,
}: {
  id: string;
  version: number;
  page: number;
  owned: boolean;
  historical: boolean;
  usingOcr: boolean;
  hasNativeText: boolean;
  onResult: (item: OcrPage | null) => void;
  onMode: (value: boolean) => void;
}) {
  const [result, setResult] = useState<MaterialOcr | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const active = useRef(true);
  const serial = useRef(0);
  const busyRef = useRef(false);
  const onResultRef = useRef(onResult);
  const onModeRef = useRef(onMode);

  useEffect(() => {
    onResultRef.current = onResult;
    onModeRef.current = onMode;
  }, [onResult, onMode]);

  async function lookup() {
    const request = ++serial.current;

    setLoading(true);
    setError('');

    try {
      const value = await getMaterialOcr(id, version, page);

      if (!active.current || request !== serial.current) return;
      setResult(value);
      onResultRef.current(value.item?.status === 'ready' ? value.item : null);
    } catch (error) {
      if (!active.current || request !== serial.current) return;
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      if (active.current && request === serial.current) setLoading(false);
    }
  }

  useEffect(() => {
    active.current = true;
    const request = ++serial.current;

    // 페이지 변경으로 해제된 인식 결과는 새 페이지의 선택층에 적용하지 않는다.
    void getMaterialOcr(id, version, page)
      .then((value) => {
        if (!active.current || request !== serial.current) return;
        setResult(value);
        setLoading(false);
        onResultRef.current(value.item?.status === 'ready' ? value.item : null);
      })
      .catch((error) => {
        if (!active.current || request !== serial.current) return;
        if (error instanceof ApiError && error.status === 401)
          setSessionExpired(true);
        setError((error as Error).message);
        setLoading(false);
      });

    return () => {
      active.current = false;
    };
  }, [id, version, page]);

  async function recognize() {
    if (
      busyRef.current ||
      historical ||
      !owned ||
      !result?.configured ||
      !result.languageSupported ||
      result.item?.status === 'ready' ||
      result.item?.status === 'running'
    )
      return;
    busyRef.current = true;
    const request = ++serial.current;

    setBusy(true);
    setError('');
    setSessionExpired(false);

    try {
      const value = await recognizeMaterialPage(id, {
        version,
        page,
        requestId: crypto.randomUUID(),
      });

      if (!active.current || request !== serial.current) return;
      setResult(value);
      onResultRef.current(value.item?.status === 'ready' ? value.item : null);
      if (value.item?.status === 'ready') onModeRef.current(true);
    } catch (error) {
      if (!active.current || request !== serial.current) return;
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      busyRef.current = false;
      if (active.current && request === serial.current) setBusy(false);
    }
  }

  const item = result?.item;
  const running = busy || item?.status === 'running';

  return (
    <section
      className={styles.stack}
      aria-label='페이지 글자 인식'>
      <div className={styles.row}>
        <h2>페이지 글자 인식</h2>
        <Badge
          tone={
            item?.status === 'ready'
              ? 'success'
              : item?.status === 'failed'
                ? 'warning'
                : 'neutral'
          }>
          {loading
            ? '저장 결과 확인 중'
            : running
              ? '인식 중'
              : item?.status === 'ready'
                ? '인식 완료'
                : item?.status === 'failed'
                  ? '인식 실패'
                  : '저장 결과 없음'}
        </Badge>
      </div>
      <p className={styles.meta}>
        원본 v{version} · {page}페이지 · 영어 OCR 지원. 원본과 인식 결과를 따로
        보존하며 저장 결과 조회에는 새 인식을 요청하지 않습니다.
      </p>
      {result && !result.languageSupported && (
        <p className={styles.notice}>
          태국어 글자 인식은 지원하지 않습니다. PDF에 포함된 태국어 텍스트는
          기존처럼 선택할 수 있습니다.
        </p>
      )}
      {result && !result.configured && (
        <p className={styles.notice}>
          글자 인식 기능이 아직 설정되지 않았습니다. 저장된 인식 결과는 계속 열
          수 있습니다. 새 인식은 운영자에게 설정을 요청해 주세요.
        </p>
      )}
      {!owned && (
        <p className={styles.meta}>
          공유 자료는 소유자가 저장한 인식 결과를 이용할 수 있습니다.
        </p>
      )}
      {historical && (
        <p className={styles.meta}>
          보관된 원본에서는 당시 인식 결과를 조회합니다. 새 인식은 현재 원본에서
          요청하세요.
        </p>
      )}
      {item?.status === 'failed' && (
        <p className={styles.notice}>
          {item.error || '이 페이지의 글자를 인식하지 못했습니다.'} 자동으로
          재시도하지 않습니다.
        </p>
      )}
      {item?.status === 'ready' && (
        <p className={item.lowConfidenceCount ? styles.notice : styles.meta}>
          {item.lowConfidenceCount
            ? `인식 신뢰도가 낮은 영역 ${item.lowConfidenceCount}개가 있습니다. 인식한 글자 선택 후 황색 점선 영역을 확인한 뒤 저장하거나 AI에 질문해 주세요.`
            : '인식한 글자도 원본과 대조해 확인해 주세요.'}
        </p>
      )}
      {sessionExpired && <SessionRecovery />}
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
      <div className={styles.row}>
        {owned && !historical && (
          <Button
            type='button'
            size='small'
            loading={busy}
            disabled={
              loading ||
              running ||
              !result?.configured ||
              !result.languageSupported ||
              item?.status === 'ready'
            }
            onClick={() => void recognize()}>
            {item?.status === 'failed'
              ? '이 페이지 글자 인식 다시 요청'
              : '이 페이지 글자 인식'}
          </Button>
        )}
        <Button
          type='button'
          size='small'
          variant='ghost'
          disabled={loading || busy}
          onClick={() => void lookup()}>
          저장 결과 조회
        </Button>
      </div>
      {item?.status === 'ready' && (
        <div className={styles.row}>
          <Button
            type='button'
            size='small'
            variant={usingOcr ? 'secondary' : 'ghost'}
            aria-pressed={usingOcr}
            onClick={() => onMode(true)}>
            인식한 글자 선택
          </Button>
          <Button
            type='button'
            size='small'
            variant={!usingOcr ? 'secondary' : 'ghost'}
            aria-pressed={!usingOcr}
            onClick={() => onMode(false)}>
            {hasNativeText ? '원본 텍스트 선택' : '원본만 보기'}
          </Button>
        </div>
      )}
    </section>
  );
}
