import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { getQuestion, listQuestions } from './questions';

/** getQuestion 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getQuestionQuery = (id: Parameters<typeof getQuestion>[0]) =>
  queryOptions({
    queryKey: ['questions', 'getQuestion', id],
    queryFn: ({ signal }) =>
      getQuestion(id, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });

/** listQuestions 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const listQuestionsQuery = () =>
  queryOptions({
    queryKey: ['questions', 'listQuestions'],
    queryFn: ({ signal }) =>
      listQuestions((path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });
