import type { ReactNode } from 'react';
import styled from 'styled-components';

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
    height: 100vh;
  }
`;

const Window = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  border: 1px solid ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 38px;
  min-height: 38px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface};
  user-select: none;
`;

const TrafficLights = styled.div`
  display: flex;
  gap: 6px;
`;

const Dot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${p => p.$color};
  opacity: 0.85;
`;

const TitleText = styled.div`
  flex: 1;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  letter-spacing: 0.5px;
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

export const WindowFrame = ({ children, title, statusBar }: WindowFrameProps) => {
  return (
    <Frame>
      <Window>
        <TitleBar>
          <TrafficLights>
            <Dot $color="#ff5f57" />
            <Dot $color="#febc2e" />
            <Dot $color="#28c840" />
          </TrafficLights>
          <TitleText>{title}</TitleText>
          <div style={{ width: 54 }} />
        </TitleBar>
        <Content>
          {children}
        </Content>
        {statusBar}
      </Window>
    </Frame>
  );
};
