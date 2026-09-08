import type { ReactNode } from 'react';
import styled from 'styled-components';

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 0.5rem;

  @media (min-width: 768px) {
    padding: 1.75rem;
  }
`;

const Window = styled.div`
  position: relative; /* the matrix overlay anchors to this */
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  border: 1px solid ${({ theme }) => theme.colors.overlay};
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.35),
    0 2px 8px rgba(0, 0, 0, 0.2);
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  height: 36px;
  min-height: 36px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.overlay};
  user-select: none;
`;

const TrafficLights = styled.div`
  display: flex;
  gap: 7px;
  flex-shrink: 0;
`;

const Dot = styled.span<{ $color: string }>`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${p => p.$color};
`;

const TitleText = styled.div`
  flex: 1;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

interface WindowFrameProps {
  children: ReactNode;
  title: string;
  statusBar?: ReactNode;
}

export const WindowFrame = ({ children, title, statusBar }: WindowFrameProps) => (
  <Frame>
    <Window>
      <TitleBar>
        <TrafficLights aria-hidden="true">
          <Dot $color="#ff5f57" />
          <Dot $color="#febc2e" />
          <Dot $color="#28c840" />
        </TrafficLights>
        <TitleText>{title}</TitleText>
        {/* Balances the traffic lights so the title stays optically centred. */}
        <div style={{ width: 47, flexShrink: 0 }} aria-hidden="true" />
      </TitleBar>
      <Content>{children}</Content>
      {statusBar}
    </Window>
  </Frame>
);
