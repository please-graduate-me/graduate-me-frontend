import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import {
  getCommunityPost,
  listRelatedCommunityPosts,
  listCommunityPosts,
} from './community';

/** getCommunityPost 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getCommunityPostQuery = (
  id: Parameters<typeof getCommunityPost>[0]
) =>
  queryOptions({
    queryKey: ['community', 'getCommunityPost', id],
    queryFn: ({ signal }) =>
      getCommunityPost(id, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });

/** listRelatedCommunityPosts 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const listRelatedCommunityPostsQuery = (
  id: Parameters<typeof listRelatedCommunityPosts>[0]
) =>
  queryOptions({
    queryKey: ['community', 'listRelatedCommunityPosts', id],
    queryFn: ({ signal }) =>
      listRelatedCommunityPosts(id, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });

/** listCommunityPosts 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const listCommunityPostsQuery = (
  input: Parameters<typeof listCommunityPosts>[0]
) =>
  queryOptions({
    queryKey: ['community', 'listCommunityPosts', input],
    queryFn: ({ signal }) =>
      listCommunityPosts(input, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });
