import styled from 'styled-components';

const PromptContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.prompt};
  font-weight: bold;
`;

const User = styled.span`
  color: ${({ theme }) => theme.colors.prompt};
`;

const Host = styled.span`
  color: ${({ theme }) => theme.colors.command};
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0 0.5rem;
`;

export const Prompt = () => {
  return (
    <PromptContainer>
      <User>visitor</User>@<Host>terminal</Host>
      <Separator>:~$</Separator>
    </PromptContainer>
  );
};
