import { useEffect } from 'react';
import styled from 'styled-components';
import type { SidePanelContent, PanelSectionData } from '../types';
import { fadeIn } from '../styles/GlobalStyle';

const Backdrop = styled.div<{ $open: boolean }>`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: ${p => p.$open ? 1 : 0};
  pointer-events: ${p => p.$open ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
  z-index: 10;
`;

const PanelContainer = styled.div<{ $open: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 380px;
  max-width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-left: 1px solid ${({ theme }) => theme.colors.surface};
  transform: translateX(${p => p.$open ? '0' : '100%'});
  transition: transform 0.3s ease-out;
  z-index: 11;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const GradientLine = styled.div`
  height: 2px;
  background: linear-gradient(90deg, #f4b8e4, ${({ theme }) => theme.colors.accent});
  flex-shrink: 0;
`;

const PanelHeader = styled.div`
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
`;

const HeaderText = styled.div``;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.foreground};
`;

const Subtitle = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 0.25rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  font-family: ${({ theme }) => theme.font};
  font-size: 14px;
  padding: 0;
  line-height: 1;
  &:hover { color: ${({ theme }) => theme.colors.foreground}; }
`;

const PanelBody = styled.div`
  padding: 0 1.25rem 1.25rem;
  flex: 1;
`;

const SectionWrapper = styled.div<{ $delay: number }>`
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.3s ease-out ${p => p.$delay}s both;
`;

const SectionLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #f4b8e4, ${({ theme }) => theme.colors.accent});
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-family: ${({ theme }) => theme.font};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.muted}33;
  border-radius: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.accent};
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const LinkItem = styled.a`
  color: ${({ theme }) => theme.colors.link};
  text-decoration: none;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  &:hover { text-decoration: underline; }
  &::before { content: '->'; color: ${({ theme }) => theme.colors.muted}; font-size: 11px; }
`;

const TextBlock = styled.div`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const GalleryRow = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
`;

const GalleryItem = styled.div`
  min-width: 120px;
  height: 160px;
  background: linear-gradient(135deg, #f4b8e4, ${({ theme }) => theme.colors.accent});
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  font-family: ${({ theme }) => theme.font};
  text-align: center;
  padding: 0.5rem;
  flex-shrink: 0;
`;

function renderSection(data: PanelSectionData) {
  switch (data.kind) {
    case 'image':
      return data.src
        ? <img src={data.src} alt={data.alt} style={{ width: '100%', borderRadius: 6 }} />
        : <ImagePlaceholder>{data.alt}</ImagePlaceholder>;

    case 'tags':
      return (
        <TagsContainer>
          {data.items.map((item, i) => (
            <Tag key={i} style={item.color ? { borderColor: item.color, color: item.color } : undefined}>
              {item.label}
            </Tag>
          ))}
        </TagsContainer>
      );

    case 'links':
      return (
        <LinkList>
          {data.items.map((item, i) => (
            <LinkItem key={i} href={item.url} target="_blank" rel="noopener noreferrer">
              {item.label}
            </LinkItem>
          ))}
        </LinkList>
      );

    case 'text':
      return <TextBlock>{data.content}</TextBlock>;

    case 'gallery':
      return (
        <GalleryRow>
          {data.items.map((item, i) => (
            item.src
              ? <img key={i} src={item.src} alt={item.alt} style={{ height: 160, borderRadius: 4 }} />
              : <GalleryItem key={i}>{item.alt}</GalleryItem>
          ))}
        </GalleryRow>
      );
  }
}

interface SidePanelProps {
  content: SidePanelContent | null;
  open: boolean;
  onClose: () => void;
}

export const SidePanel = ({ content, open, onClose }: SidePanelProps) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [open, onClose]);

  return (
    <>
      <Backdrop $open={open} onClick={onClose} />
      <PanelContainer $open={open}>
        {content && (
          <>
            <GradientLine />
            <PanelHeader>
              <HeaderText>
                <Title>{content.title}</Title>
                {content.subtitle && <Subtitle>{content.subtitle}</Subtitle>}
              </HeaderText>
              <CloseButton onClick={onClose}>[x]</CloseButton>
            </PanelHeader>
            <PanelBody>
              {content.sections.map((section, i) => (
                <SectionWrapper key={i} $delay={i * 0.1}>
                  {section.label && <SectionLabel>{section.label}</SectionLabel>}
                  {renderSection(section.data)}
                </SectionWrapper>
              ))}
            </PanelBody>
          </>
        )}
      </PanelContainer>
    </>
  );
};
