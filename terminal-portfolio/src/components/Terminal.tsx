import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTerminal } from '../hooks/useTerminal';
import { Output } from './Output';
import { Prompt } from './Prompt';

const TerminalContainer = styled.div`
  padding: 1.5rem;
  min-height: 100vh;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.foreground};
  font-family: ${({ theme }) => theme.font};
  font-size: 16px;
  flex: 1;
  margin-left: 0.5rem;
  outline: none;
`;

const WelcomeMessage = styled.div`
  margin-bottom: 2rem;
  line-height: 1.5;
`;

export const Terminal = () => {
  const { history, processCommand } = useTerminal();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [history]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <TerminalContainer onClick={handleContainerClick}>
      <WelcomeMessage>
        <div>Welcome to the interactive portfolio of <strong>Francis Escares Padua</strong>.</div>
        <div>Type <strong>'help'</strong> to get started.</div>
      </WelcomeMessage>

      {history.map((item) => (
        <Output key={item.id} item={item} />
      ))}

      <InputArea>
        <Prompt />
        <Input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </InputArea>
      <div ref={bottomRef} />
    </TerminalContainer>
  );
};
