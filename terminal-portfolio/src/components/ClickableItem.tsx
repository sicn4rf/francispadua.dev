import type { ReactNode } from 'react';
import styled from 'styled-components';
import type { SidePanelContent } from '../types';

const Wrapper = styled.div`
  cursor: pointer;
  border-left: 2px solid transparent;
  padding-left: 0.5rem;
  margin-left: -0.5rem;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    border-left-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.surface}44;
  }

  &:hover .view-hint {
    opacity: 1;
  }
`;

const ViewHint = styled.span`
  position: absolute;
  right: 0.5rem;
  top: 0.25rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
  opacity: 0;
  transition: opacity 0.15s ease;
`;

interface ClickableItemProps {
  children: ReactNode;
  panel: SidePanelContent;
  openSidePanel: (content: SidePanelContent) => void;
}

export const ClickableItem = ({ children, panel, openSidePanel }: ClickableItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openSidePanel(panel);
  };

  return (
    <Wrapper onClick={handleClick}>
      {children}
      <ViewHint className="view-hint">[view]</ViewHint>
    </Wrapper>
  );
};
