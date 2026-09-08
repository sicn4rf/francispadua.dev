import styled from 'styled-components';

const Container = styled.span`
  display: inline-flex;
  align-items: baseline;
  white-space: nowrap;
  user-select: none;
`;

const User = styled.span`
  color: ${({ theme }) => theme.colors.green};
`;

const At = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;

const Host = styled.span`
  color: ${({ theme }) => theme.colors.teal};
`;

const Path = styled.span`
  color: ${({ theme }) => theme.colors.blue};
  font-weight: 600;
  margin-left: 0.5ch;
`;

const Sigil = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  margin-left: 0.5ch;
  margin-right: 0.25ch;
`;

export const Prompt = ({ cwd = '~' }: { cwd?: string }) => (
  <Container aria-hidden="true">
    <User>visitor</User>
    <At>@</At>
    <Host>portfolio</Host>
    <Path>{cwd}</Path>
    <Sigil>❯</Sigil>
  </Container>
);
