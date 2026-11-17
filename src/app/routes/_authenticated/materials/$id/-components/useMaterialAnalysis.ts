import { useEffect, useRef, useState } from 'react';
import {
  getMaterialAnalysis,
  retryMaterialAnalysis,
} from '@/domains/materials/api/analysis';
import type { MaterialAnalysisResponse } from '@/domains/materials/model/analysis';
import { ApiError } from '@/lib/api/request';

/** 저장된 문서 정리 하나를 패널 여러 곳이 함께 쓰도록 조회 상태와 재요청을 묶은 값이다. */
export type MaterialAnalysisState = ReturnType<typeof useMaterialAnalysis>;

/** 자료를 다시 열어도 저장 분석을 복원하고 진행 중일 때만 상태를 갱신한다. */
export function useMaterialAnalysis(materialId: string, version: number) {
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

  return {
    value,
    loading,
    busy,
    error,
    sessionExpired,
    retry,
    reload: () => setRefresh((count) => count + 1),
  };
}
