import { useState } from 'react';
import { Button } from '@/components/ui/primitives/Button';
import { CourseAssignmentEditor } from '../../-components/CourseAssignmentEditor';

/** 과제 목록 제목 옆에서 담당자가 새 과제 편집 창을 연다. */
export function CourseAssignmentCreate({
  courseId,
  language,
}: {
  courseId: string;
  language: 'en' | 'th';
}) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <Button
        type='button'
        variant='ink'
        size='comfortable'
        startIcon='plus'
        onClick={() => setEditing(true)}>
        과제 만들기
      </Button>
      {editing && (
        <CourseAssignmentEditor
          courseId={courseId}
          language={language}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
