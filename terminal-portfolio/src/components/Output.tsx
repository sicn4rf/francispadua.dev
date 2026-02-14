import styled from 'styled-components';
import type { HistoryItem } from '../types';
import { Prompt } from './Prompt';

const OutputContainer = styled.div`
  margin-bottom: 1rem;
`;

const CommandRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CommandText = styled.div`
  color: ${({ theme }) => theme.colors.command};
  margin-left: 0.5rem;
`;

const ResultContainer = styled.div`
  color: ${({ theme }) => theme.colors.result};
  margin-left: 1rem;
`;

interface OutputProps {
  item: HistoryItem;
}

export const Output = ({ item }: OutputProps) => {
  return (
    <OutputContainer>
      <CommandRow>
        <Prompt />
        <CommandText>{item.command}</CommandText>
      </CommandRow>
      <ResultContainer>{item.output}</ResultContainer>
    </OutputContainer>
  );
};
