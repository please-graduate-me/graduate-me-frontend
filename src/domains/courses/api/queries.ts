import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { getCourse, getAssignment, listCourses } from './courses';

/** getCourse 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getCourseQuery = (id: Parameters<typeof getCourse>[0]) =>
  queryOptions({
    queryKey: ['courses', 'getCourse', id],
    queryFn: ({ signal }) =>
      getCourse(id, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });

/** getAssignment 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getAssignmentQuery = (
  id: Parameters<typeof getAssignment>[0],
  assignmentId: Parameters<typeof getAssignment>[1]
) =>
  queryOptions({
    queryKey: ['courses', 'getAssignment', id, assignmentId],
    queryFn: ({ signal }) =>
      getAssignment(id, assignmentId, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });

/** listCourses 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const listCoursesQuery = () =>
  queryOptions({
    queryKey: ['courses', 'listCourses'],
    queryFn: ({ signal }) =>
      listCourses((path, init) => browserTransport(path, { ...init, signal })),
  });
