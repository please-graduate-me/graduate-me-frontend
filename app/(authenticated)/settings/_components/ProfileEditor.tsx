'use client';
import { Banner } from '@/components/ui/composites/Banner';
import { Text } from '@/components/ui/primitives/Text';
import { Icon } from '@/components/ui/primitives/Icon';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveLearningProfile } from '@/domains/users/api/profile';
import type { LearningProfile } from '@/domains/users/model/profile';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Select } from '@/components/ui/primitives/Select';
import { RadioList } from '@/components/ui/primitives/RadioList';
import { RadioListItem } from '@/components/ui/primitives/RadioListItem';
import { SegmentedControl } from '@/components/ui/primitives/SegmentedControl';
import { SegmentedControlItem } from '@/components/ui/primitives/SegmentedControlItem';
import * as styles from './ProfileEditor.css';

const targets: {
  value: LearningProfile['targetLanguage'];
  code: string;
  label: string;
}[] = [
  { value: 'en', code: 'EN', label: '영어' },
  { value: 'th', code: 'TH', label: '태국어' },
];

const levels: { value: LearningProfile['level']; label: string }[] = [
  { value: 'beginner', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
];

/** 설명 언어와 관심 주제를 실제 계정 프로필에 저장한다. */
export function ProfileEditor({ initial }: { initial: LearningProfile }) {
  const router = useRouter();
  const [profile, setProfile] = useState(initial);
  const [interests, setInterests] = useState(initial.interests.join(', '));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [saved, setSaved] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setSaved(false);

    try {
      const value = await saveLearningProfile({
        ...profile,
        interests: [
          ...new Set(
            interests
              .split(',')
              .map((value) => value.trim())
              .filter(Boolean)
          ),
        ],
      });

      setProfile(value);
      setInterests(value.interests.join(', '));
      setSaved(true);
      router.refresh();
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void submit(event)}
      className={styles.form}>
      {profile.isHelper && (
        <Banner
          status='success'
          role='note'
          layout='inline'
          title='안내'>
          조교 · 커뮤니티에서 학습자들과 함께 활동합니다.
        </Banner>
      )}
      <fieldset
        className={styles.fields}
        disabled={busy}>
        <RadioList
          label='목표 언어'
          variant='tile'
          value={profile.targetLanguage}
          isDisabled={busy}
          onChange={(value) =>
            setProfile((current) => ({
              ...current,
              targetLanguage: value as LearningProfile['targetLanguage'],
            }))
          }>
          {targets.map((target) => (
            <RadioListItem
              key={target.value}
              value={target.value}
              icon={
                <span
                  aria-hidden='true'
                  className={styles.code}>
                  {target.code}
                </span>
              }
              label={target.label}
            />
          ))}
        </RadioList>
        <div className={styles.pair}>
          <Select
            className={styles.pairField}
            disabled={busy}
            label='설명 언어'
            value={profile.explanationLanguage}
            onChange={(event) =>
              setProfile((value) => ({
                ...value,
                explanationLanguage: event.target
                  .value as LearningProfile['explanationLanguage'],
              }))
            }>
            <option value='ko'>한국어</option>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
          <div className={styles.pairItem}>
            {/* 분할 선택은 접근성 이름만 받으므로 보이는 이름은 중복 낭독을 막아 따로 둔다. */}
            <span
              aria-hidden='true'
              className={styles.label}>
              현재 수준 · 자기평가
            </span>
            <SegmentedControl
              label='현재 수준 · 자기평가'
              value={profile.level}
              variant='block'
              isDisabled={busy}
              onChange={(value) =>
                setProfile((current) => ({
                  ...current,
                  level: value as LearningProfile['level'],
                }))
              }>
              {levels.map((level) => (
                <SegmentedControlItem
                  key={level.value}
                  value={level.value}
                  label={level.label}
                />
              ))}
            </SegmentedControl>
          </div>
        </div>
        <Input
          disabled={busy}
          label='관심 주제'
          value={interests}
          maxLength={2039}
          onChange={(event) => setInterests(event.target.value)}
          placeholder='회화, 언어학, 경제 · 쉼표로 구분해 최대 20개'
        />
        <Text
          as='p'
          display='block'
          className={styles.note}>
          언어를 바꾸어도 이전 언어의 자료와 답안·표현·질문 기록은 유지됩니다.
          자기평가 수준은 연습 난이도의 참고값으로 사용합니다.
        </Text>
        <div className={styles.actions}>
          <Button
            variant='ink'
            size='comfortable'
            loading={busy}
            disabled={busy}>
            학습 프로필 저장
          </Button>
          {saved && (
            <p
              role='status'
              className={styles.saved}>
              <Icon
                name='check'
                size={16}
              />
              학습 프로필을 저장했습니다.
            </p>
          )}
        </div>
      </fieldset>
      {sessionExpired && <SessionRecovery />}
      {error && (
        <Banner
          status='error'
          icon='circle-alert'
          title='확인이 필요해요'
          role='alert'>
          {error}
        </Banner>
      )}
    </form>
  );
}
