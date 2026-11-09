import { request, type Transport } from '@/lib/api/request';
import { archivedVideoSourceSchema } from '../model/archive';

/** 현재 정답 공개와 분리해 본인 학습 자료의 과거 버전만 조회한다. */
export const getArchivedVideoSource = (
  videoId: string,
  segmentId: string,
  version: number,
  transport?: Transport
) =>
  request(
    `/api/learning/video-source/${encodeURIComponent(videoId)}/${encodeURIComponent(segmentId)}?version=${version}`,
    archivedVideoSourceSchema,
    undefined,
    transport
  );
