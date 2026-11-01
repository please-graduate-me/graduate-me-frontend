'use client';
import type { LearningSettings } from '@/domains/users/model/settings';
import { LearningOptions } from '../../_components/LearningOptions';
import { useLearningSettings } from '../../_components/useLearningSettings';

/** 설정 페이지에서도 학습 중과 동일한 계정 옵션을 편집한다. */
export function SettingsEditor({ initial }: { initial: LearningSettings }) {
  const { settings, saving, error, change } = useLearningSettings(initial);
  return (
    <LearningOptions
      settings={settings}
      saving={saving}
      error={error}
      onChange={(next) => void change(next)}
    />
  );
}
