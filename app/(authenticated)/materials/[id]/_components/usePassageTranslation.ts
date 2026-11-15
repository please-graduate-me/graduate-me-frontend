'use client';
import { useEffect, useRef, useState } from 'react';
import {
  generateExplanation,
  listExplanations,
} from '@/domains/ai/api/learning';
import { canStartNewGeneration } from '@/domains/ai/lib/generationFailure';
import type { SourceInput } from '@/domains/materials/model/source';
import { ApiError } from '@/lib/api/request';

const compact = (text: string) => text.normalize('NFKC').replace(/\s+/g, '');

/** 같은 발췌의 저장 설명에서 번역만 꺼내고, 없을 때는 사용자가 요청한 순간에만 번역을 만든다. */
export function usePassageTranslation(
  source: SourceInput,
  onGenerated?: () => void
) {
  const serial = JSON.stringify(source);
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const requestId = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    const selected: SourceInput = JSON.parse(serial);

    // 목록 조회는 저장 결과만 읽으므로 AI 호출 없이 바로 보여 줄 수 있다.
    void listExplanations(selected)
      .then((result) => {
        if (!active) return;

        const stored = result.items.find(
          (item) =>
            compact(item.source.quote) === compact(selected.quote) &&
            (item.source.version ?? 1) === (selected.version ?? 1) &&
            (item.source.kind !== 'pdf' ||
              selected.kind !== 'pdf' ||
              (item.source.ocrId ?? null) === (selected.ocrId ?? null)) &&
            item.payload.translation.trim()
        );

        setTranslation(stored?.payload.translation ?? '');
        setLoading(false);
      })
      .catch(() => {
        // 저장 번역 조회 실패는 번역 보기 버튼으로 다시 시도할 수 있어 조용히 넘긴다.
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [serial]);

  async function request() {
    if (busy) return;
    setBusy(true);
    setError('');
    setSessionExpired(false);
    // 응답을 잃은 재시도에도 같은 실행 ID를 써서 중복 유료 생성을 막는다.
    requestId.current ??= crypto.randomUUID();

    try {
      const value = await generateExplanation({
        requestId: requestId.current,
        source,
        mode: 'translation',
      });

      requestId.current = null;
      setTranslation(value.payload.translation);
      onGenerated?.();
    } catch (failure) {
      setError((failure as Error).message);
      setSessionExpired(failure instanceof ApiError && failure.status === 401);
      if (canStartNewGeneration(failure)) requestId.current = null;
    } finally {
      setBusy(false);
    }
  }

  return { translation, loading, busy, error, sessionExpired, request };
}
