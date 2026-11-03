'use client';
import { useRef, useState } from 'react';
import { saveLearningSettings } from '@/domains/users/api/settings';
import type { LearningSettings } from '@/domains/users/model/settings';

/** 두 화면의 즉시 적용과 저장 실패 복구를 같은 규칙으로 처리한다. */
export function useLearningSettings(initial: LearningSettings) {
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);

  async function change(next: LearningSettings) {
    if (pending.current) return;
    pending.current = true;
    const previous = settings;

    setSettings(next);
    setSaving(true);
    setError('');

    try {
      setSettings(await saveLearningSettings(next));
    } catch {
      setSettings(previous);

      setError(
        '옵션을 저장하지 못해 이전 설정으로 돌아갔습니다. 다시 선택해 주세요.'
      );
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  return { settings, saving, error, change };
}
