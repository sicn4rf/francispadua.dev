import styled from 'styled-components';
import type { SidePanelContent, PanelSectionData } from '../types';
import { fadeIn } from '../styles/GlobalStyle';

/**
 * A zellij-style split pane rather than a modal drawer: on a wide viewport the
 * terminal shrinks and this sits beside it with a titled border, so both stay
 * usable at once. Below 900px there is no room to split, so it slides over.
 */

const Pane = styled.aside<{ $open: boolean }>`
  flex: 0 0 ${p => (p.$open ? '380px' : '0px')};
  width: ${p => (p.$open ? '380px' : '0px')};
  overflow: hidden;
  transition: flex-basis 0.22s ease, width 0.22s ease;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => theme.colors.overlay};
  background: ${({ theme }) => theme.colors.background};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  /* No room to split — overlay the terminal instead. */
  @media (max-width: 900px) {
    position: absolute;
    inset: 0;
    width: 100%;
    flex-basis: auto;
    z-index: 12;
    transform: translateX(${p => (p.$open ? '0' : '100%')});
    transition: transform 0.22s ease-out;
    pointer-events: ${p => (p.$open ? 'auto' : 'none')};
  }
`;

/** zellij draws a title in the pane border; this is the same idea. */
const PaneTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 26px;
  min-height: 26px;
  padding: 0 10px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.overlay};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  user-select: none;
  white-space: nowrap;
`;

const PaneLabel = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;
`;

const CloseButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  padding: 2px 4px;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem 1.1rem 1.5rem;
  min-width: 380px;

  @media (max-width: 900px) {
    min-width: 0;
  }
`;

const Title = styled.h2`
  font-size: 17px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors.foreground};
`;

const Subtitle = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 0.2rem;
  margin-bottom: 1rem;
`;

const Section = styled.section<{ $delay: number }>`
  margin-bottom: 1.1rem;
  animation: ${fadeIn} 0.25s ease-out ${p => p.$delay}s both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const SectionLabel = styled.h3`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 0.45rem;
  font-weight: 600;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const Tag = styled.span`
  padding: 0.2rem 0.55rem;
  background: ${({ theme }) => theme.colors.overlay};
  border-radius: 4px;
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.accent};
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const LinkItem = styled.a`
  color: ${({ theme }) => theme.colors.link};
  text-decoration: none;
  font-size: 12.5px;
  display: flex;
  align-items: center;
  gap: 0.45rem;

  &::before {
    content: '→';
    color: ${({ theme }) => theme.colors.muted};
  }

  &:hover {
    text-decoration: underline;
  }
`;

const TextBlock = styled.div`
  color: ${({ theme }) => theme.colors.result};
  font-size: 12.5px;
  line-height: 1.65;
  white-space: pre-wrap;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 150px;
  border: 1px dashed ${({ theme }) => theme.colors.overlay};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
`;

const GalleryRow = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
`;

const GalleryItem = styled(Placeholder)`
  min-width: 118px;
  height: 150px;
  flex-shrink: 0;
  text-align: center;
  padding: 0.5rem;
`;

function renderSection(data: PanelSectionData) {
  switch (data.kind) {
    case 'image':
      return data.src ? (
        <img src={data.src} alt={data.alt} style={{ width: '100%', borderRadius: 6 }} />
      ) : (
        <Placeholder>{data.alt}</Placeholder>
      );

    case 'tags':
      return (
        <TagRow>
          {data.items.map(item => (
            <Tag key={item.label} style={item.color ? { color: item.color } : undefined}>
              {item.label}
            </Tag>
          ))}
        </TagRow>
      );

    case 'links':
      return (
        <LinkList>
          {data.items.map(item => (
            <LinkItem key={item.url} href={item.url} target="_blank" rel="noopener noreferrer">
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
          {data.items.map(item =>
            item.src ? (
              <img key={item.alt} src={item.src} alt={item.alt} style={{ height: 150, borderRadius: 4 }} />
            ) : (
              <GalleryItem key={item.alt}>{item.alt}</GalleryItem>
            ),
          )}
        </GalleryRow>
      );
  }
}

interface SidePanelProps {
  content: SidePanelContent | null;
  open: boolean;
  onClose: () => void;
}

export const SidePanel = ({ content, open, onClose }: SidePanelProps) => (
  <Pane $open={open} aria-hidden={!open} inert={!open ? true : undefined}>
    {content && (
      <>
        <PaneTitle>
          <PaneLabel>pane</PaneLabel>
          <span>{content.title}</span>
          <CloseButton onClick={onClose} aria-label="Close pane">
            Esc ✕
          </CloseButton>
        </PaneTitle>
        <Scroll>
          <Title>{content.title}</Title>
          {content.subtitle && <Subtitle>{content.subtitle}</Subtitle>}
          {content.sections.map((section, i) => (
            <Section key={section.label ?? i} $delay={i * 0.06}>
              {section.label && <SectionLabel>{section.label}</SectionLabel>}
              {renderSection(section.data)}
            </Section>
          ))}
        </Scroll>
      </>
    )}
  </Pane>
);
