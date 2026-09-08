import styled from 'styled-components';

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 24px;
  min-height: 24px;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.surface};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  user-select: none;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Indicator = styled.span<{ $active?: boolean }>`
  color: ${({ theme, $active }) => $active ? theme.colors.green : theme.colors.muted};
`;

interface StatusBarProps {
  cwd: string;
  themeName: string;
  soundEnabled: boolean;
}

export const StatusBar = ({ cwd, themeName, soundEnabled }: StatusBarProps) => {
  return (
    <Bar>
      <Section>
        <span>{cwd}</span>
      </Section>
      <Section>
        <Indicator $active={soundEnabled}>
          {soundEnabled ? 'sound:on' : 'sound:off'}
        </Indicator>
        <span>theme:{themeName}</span>
      </Section>
    </Bar>
  );
};
