import type { SourceInput } from '../model/source';

/** PDF와 영상에서 출처 링크를 동일하게 생성한다. */
export const materialPaths = {
  list: '/materials',
  detail: (id: string, page?: number) =>
    `/materials/${encodeURIComponent(id)}${page ? `?page=${page}` : ''}`,
  source: (source: SourceInput) =>
    source.kind === 'pdf'
      ? `/materials/${encodeURIComponent(source.materialId)}?page=${source.page}`
      : `/learn/${encodeURIComponent(source.videoId)}?segment=${encodeURIComponent(source.segmentId)}`,
};
