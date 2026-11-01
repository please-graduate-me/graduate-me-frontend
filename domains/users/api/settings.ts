import { jsonBody, request, type Transport } from '@/lib/api/request';
import {
  learningSettingsSchema,
  type LearningSettings,
} from '../model/settings';
/** 화면 진입 시 저장된 계정 옵션을 복원한다. */
export const getLearningSettings = (transport?: Transport) =>
  request('/api/me/settings', learningSettingsSchema, undefined, transport);

/** 설정 화면이 바뀌어도 계정별 저장 경로를 유지한다. */
export const saveLearningSettings = (settings: LearningSettings) =>
  request(
    '/api/me/settings',
    learningSettingsSchema,
    jsonBody(learningSettingsSchema.parse(settings))
  );
