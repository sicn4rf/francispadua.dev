import styled from 'styled-components';

const PromptContainer = styled.span`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
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

const Sep = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;

const Path = styled.span`
  color: ${({ theme }) => theme.colors.blue};
  font-weight: bold;
`;

const Dollar = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  margin-left: 4px;
`;

interface PromptProps {
  cwd?: string;
}

export const Prompt = ({ cwd = '~' }: PromptProps) => {
  const displayPath = cwd === '~' ? '~' : cwd.replace(/^~/, '~');

  return (
    <PromptContainer>
      <User>visitor</User>
      <At>@</At>
      <Host>portfolio</Host>
      <Sep>:</Sep>
      <Path>{displayPath}</Path>
      <Dollar>$</Dollar>
    </PromptContainer>
  );
};
