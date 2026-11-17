import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getCommunityPost,
  getTaggedCount,
  listCommunityPosts,
  listRelatedCommunityPosts,
  saveCommunityPost,
} from './community';

const post = {
  id: 'post',
  kind: 'meaning',
  helperAnswered: false,
  lastActivityAt: '',
  ownerId: 'owner',
  title: '조교와 함께 보는 글',
  body: '질문 내용',
  language: 'en',
  source: null,
  visibility: 'public',
  allowedUserIds: [],
  taggedHelperIds: ['helper'],
  taggedHelpers: [{ id: 'helper', name: '조교' }],
  createdAt: '',
  updatedAt: '',
  owned: false,
  likes: 0,
  liked: false,
  following: false,
  author: { id: 'owner', name: '학습자', isHelper: false },
};

afterEach(() => vi.unstubAllGlobals());

describe('조교 태그와 커뮤니티 댓글 계약', () => {
  it('조교 댓글을 일반 댓글과 같은 게시글에서 복원한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          ...post,
          expressionSource: null,
          comments: [
            {
              id: 'comment',
              body: '공개 댓글 답변',
              createdAt: '',
              owned: false,
              author: { id: 'helper', name: '조교', isHelper: true },
            },
          ],
        })
      )
    );

    const result = await getCommunityPost('post');

    expect(result.comments[0].author.isHelper).toBe(true);
    expect(result.taggedHelpers[0].name).toBe('조교');
    expect(result.expressionSource).toBeNull();
  });

  it('글 종류가 없거나 정해진 네 가지가 아니면 응답을 거부한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          ...post,
          kind: 'question',
          expressionSource: null,
          comments: [],
        })
      )
    );

    await expect(getCommunityPost('post')).rejects.toThrow();
  });

  it('조교 필터·종류 필터·같은 구절 글·미응답 태그 수를 각 경로로 조회한다', async () => {
    const fetcher = vi.fn(async (path: string) =>
      Response.json(
        path.includes('/tagged/count')
          ? { count: 3 }
          : path.includes('/related')
            ? { items: [{ ...post, helperAnswered: true, comments: 1 }] }
            : { items: [], page: 1, limit: 20, hasMore: false }
      )
    );

    vi.stubGlobal('fetch', fetcher);

    await listCommunityPosts({
      language: 'en',
      helpers: true,
      kind: 'context',
    });

    const url = String((fetcher.mock.calls[0] as unknown as [string])[0]);

    expect(url).toContain('helpers=true');
    expect(url).toContain('kind=context');

    expect(
      (await listRelatedCommunityPosts('post')).items[0].helperAnswered
    ).toBe(true);

    expect(String((fetcher.mock.calls[1] as unknown as [string])[0])).toBe(
      '/api/community/posts/post/related'
    );

    expect(await getTaggedCount()).toEqual({ count: 3 });
  });

  it('태그 모아보기 조건을 일반 커뮤니티 조회 API로 전달한다', async () => {
    const fetcher = vi.fn(async () =>
      Response.json({
        items: [{ ...post, comments: 0 }],
        page: 1,
        limit: 20,
        hasMore: false,
      })
    );

    vi.stubGlobal('fetch', fetcher);
    await listCommunityPosts({ language: 'en', tagged: true });

    expect(String((fetcher.mock.calls[0] as unknown as [string])[0])).toContain(
      'tagged=true'
    );
  });

  it('조교 태그와 공개 대상을 각각 명시해 게시한다', async () => {
    const fetcher = vi.fn(async () => Response.json({ ...post, comments: 0 }));

    vi.stubGlobal('fetch', fetcher);

    await saveCommunityPost({
      kind: 'meaning',
      title: post.title,
      body: post.body,
      language: 'en',
      visibility: 'public',
      taggedHelperIds: ['helper'],
    });

    const [path, init] = fetcher.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];

    expect(path).toBe('/api/community/posts');

    expect(JSON.parse(String(init.body))).toMatchObject({
      kind: 'meaning',
      taggedHelperIds: ['helper'],
      visibility: 'public',
    });
  });
});
