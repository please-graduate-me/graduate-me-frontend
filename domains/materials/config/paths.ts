import type { SourceInput } from '../model/source';

const selectionQuery = (source: SourceInput) => {
  const query = new URLSearchParams({
    page: String(source.kind === 'pdf' ? source.page : 1),
    quote: source.quote,
    version: String(source.version ?? 1),
  });

  if (source.kind === 'pdf' && source.ocrId) query.set('ocrId', source.ocrId);
  if (source.rects?.[0]) query.set('rect', JSON.stringify(source.rects[0]));

  return query.toString();
};

/** PDF와 영상에서 출처 링크를 동일하게 생성한다. */
export const materialPaths = {
  list: '/materials',
  detail: (id: string, page?: number) =>
    `/materials/${encodeURIComponent(id)}${page ? `?page=${page}` : ''}`,
  source: (source: SourceInput) =>
    source.kind === 'pdf'
      ? `/materials/${encodeURIComponent(source.materialId)}?${selectionQuery(source)}`
      : `/learn/${encodeURIComponent(source.videoId)}?segment=${encodeURIComponent(source.segmentId)}&${selectionQuery(source)}`,
};
