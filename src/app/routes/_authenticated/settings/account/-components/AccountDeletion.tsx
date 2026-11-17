import { useQueryClient } from '@tanstack/react-query';
import { useRefreshData } from '../../../../-components/useRefreshData';
import { Card } from '@/components/ui/primitives/Card';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Icon } from '@/components/ui/primitives/Icon';
import { useState } from 'react';
import { Link } from '@/components/ui/primitives/Link';
import { useRouter } from '@tanstack/react-router';
import { request, jsonBody } from '@/lib/api/request';
import { okSchema } from '@/lib/api/contracts';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import * as motion from '@/lib/styles/motion.css';
import * as styles from './AccountDeletion.css';

const removed: { label: string; shape: keyof typeof styles.shape }[] = [
  { label: '내 PDF 원본', shape: 'document' },
  { label: '개인 표현집', shape: 'expression' },
  { label: '비공개 AI 대화', shape: 'conversation' },
  { label: '개인 답안과 진도·연습 기록', shape: 'practice' },
  { label: '로그인 세션', shape: 'session' },
];

/** 명시적인 삭제 확인 후 계정과 개인 학습 기록을 삭제한다. */
export function AccountDeletion({ name }: { name: string }) {
  const router = useRouter();
  const client = useQueryClient();
  const refreshData = useRefreshData();
  const [confirmation, setConfirmation] = useState('');
  const isReady = confirmation === 'DELETE';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function remove(event: React.FormEvent) {
    event.preventDefault();
    if (!isReady || busy) return;
    setBusy(true);
    setError('');

    try {
      await request('/api/me/account', okSchema, {
        ...jsonBody({ confirmation }),
        method: 'DELETE',
      });

      client.clear();
      void router.navigate({ href: '/', replace: true });
      void refreshData();
    } catch (error) {
      setError((error as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <Link
        href='/settings'
        className={styles.back}>
        <Icon
          name='chevron-left'
          size={18}
        />
        학습 설정
      </Link>
      <Heading level={1}>계정 탈퇴와 기록 삭제</Heading>
      <div className={styles.cards}>
        <Card
          as='section'
          className={styles.card}
          aria-labelledby='removed-title'>
          <div className={styles.cardHeading}>
            <span className={`${styles.iconTile} ${styles.tileTone.removed}`}>
              <Icon name='trash-2' />
            </span>
            <Heading
              level={2}
              id='removed-title'
              className={styles.cardTitle}>
              삭제되는 개인 기록
            </Heading>
          </div>
          <Text
            as='p'
            display='block'
            className={styles.prose}>
            내 PDF 원본, 개인 표현집, 비공개 AI 대화, 개인 답안과 진도·연습
            기록을 삭제합니다. 계정의 로그인 세션도 종료됩니다.
          </Text>
          <ul
            aria-label='삭제 대상'
            className={styles.chips}>
            {removed.map((item) => (
              <li
                key={item.label}
                className={styles.chip}>
                <span
                  aria-hidden='true'
                  className={styles.shape[item.shape]}
                />
                {item.label}
              </li>
            ))}
          </ul>
        </Card>
        <Card
          as='section'
          className={styles.card}
          aria-labelledby='kept-title'>
          <div className={styles.cardHeading}>
            <span className={`${styles.iconTile} ${styles.tileTone.kept}`}>
              <Icon name='message-circle' />
            </span>
            <Heading
              level={2}
              id='kept-title'
              className={styles.cardTitle}>
              다른 사람의 기록에 남을 수 있는 내용
            </Heading>
          </div>
          <Text
            as='p'
            display='block'
            className={styles.prose}>
            이미 다른 사람의 질문에 공개한 답변과 당시 작성자 이름, 운영 변경
            이력은 대화와 근거 기록의 연속성을 위해 보존됩니다. 다른 사람의 개인
            학습 기록은 삭제하지 않습니다.
          </Text>
          {/* 실제 대화 대신 질문과 공개 답변의 자리만 그려 보존 범위를 설명한다. */}
          <div
            aria-hidden='true'
            className={styles.thread}>
            <span className={styles.question} />
            <span className={styles.answer} />
            <span className={styles.threadCaption}>
              {name} · 공개 답변 보존
            </span>
          </div>
        </Card>
      </div>
      <Card
        variant='muted'
        role='note'
        className={styles.note}>
        <Icon
          name='info'
          className={styles.noteIcon}
        />
        <Text
          as='p'
          display='block'
          size='sm'>
          <strong className={styles.noteTitle}>안내</strong> · 탈퇴는 되돌릴 수
          없습니다. 로그아웃만 하면 계정과 학습 기록은 그대로 유지됩니다.
        </Text>
      </Card>
      <form
        className={styles.confirm}
        aria-label='계정 탈퇴 확인'
        onSubmit={(event) => void remove(event)}>
        <Input
          className={styles.confirmField}
          label='위 내용을 확인했다면 DELETE를 입력해 주세요.'
          labelSize='large'
          size='large'
          tone='danger'
          isNumeric
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          autoComplete='off'
          spellCheck={false}
          placeholder='DELETE'
          disabled={busy}
        />
        <div>
          <Button
            variant='danger'
            size='comfortable'
            shape='rounded'
            // 확인 문구를 다 입력한 순간 버튼이 떠오르며 실행할 수 있게 됐음을 알린다.
            className={isReady ? motion.rise : undefined}
            startIcon={isReady ? 'trash-2' : undefined}
            disabled={busy || !isReady}
            loading={busy}>
            계정과 개인 기록 삭제
          </Button>
        </div>
        {error && (
          <Banner
            status='error'
            layout='inline'
            isOutlined
            title='확인이 필요해요'
            className={styles.error}
            role='alert'>
            {error}
          </Banner>
        )}
      </form>
    </div>
  );
}
