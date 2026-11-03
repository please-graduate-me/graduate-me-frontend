import { request } from '@/lib/api/request';
import { demoLessonSchema } from '../model/demo';

/** 공개 체험은 개인 학습 API에 접근하지 않는다. */
export const getDemoLesson = () => request('/api/demo', demoLessonSchema);
