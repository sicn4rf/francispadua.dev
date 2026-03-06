import styled from 'styled-components';
import type { HistoryItem } from '../types';
import { Prompt } from './Prompt';
import { fadeIn } from '../styles/GlobalStyle';

const OutputContainer = styled.div`
  margin-bottom: 0.75rem;
  animation: ${fadeIn} 0.15s ease-out;
`;

const CommandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const CommandText = styled.span`
  color: ${({ theme }) => theme.colors.accent};
`;

const ResultContainer = styled.div`
  color: ${({ theme }) => theme.colors.result};
  padding-left: 0.25rem;
`;

interface OutputProps {
  item: HistoryItem;
  cwd: string;
}

export const Output = ({ item, cwd }: OutputProps) => {
  return (
    <OutputContainer>
      <CommandRow>
        <Prompt cwd={cwd} />
        <CommandText>{item.command}</CommandText>
      </CommandRow>
      {item.output && <ResultContainer>{item.output}</ResultContainer>}
    </OutputContainer>
  );
};
