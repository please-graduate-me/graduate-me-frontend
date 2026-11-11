import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getCommunityPost,
  listCommunityPosts,
  saveCommunityPost,
} from './community';

const post = {
  id: 'post',
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
      taggedHelperIds: ['helper'],
      visibility: 'public',
    });
  });
});
