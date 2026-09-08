import styled from 'styled-components';
import type { HistoryItem } from '../types';
import { Prompt } from './Prompt';
import { fadeIn, prefersReducedMotion } from '../styles/GlobalStyle';

const Block = styled.div`
  margin-bottom: 0.85rem;
  animation: ${fadeIn} 0.12s ease-out;

  ${prefersReducedMotion} {
    animation: none;
  }
`;

const CommandRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
`;

const CommandText = styled.span`
  color: ${({ theme }) => theme.colors.command};
`;

const Result = styled.div`
  color: ${({ theme }) => theme.colors.result};
`;

export const Output = ({ item }: { item: HistoryItem }) => (
  <Block>
    <CommandRow>
      {/* The cwd is captured per-entry, so scrollback keeps the prompt it ran under. */}
      <Prompt cwd={item.cwd} />
      <CommandText>{item.command}</CommandText>
    </CommandRow>
    {item.output ? <Result>{item.output}</Result> : null}
  </Block>
);
