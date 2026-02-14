import React from 'react';
import styled from 'styled-components';
import type { Command } from '../types';

const Link = styled.a`
  color: ${({ theme }) => theme.colors.link};
  text-decoration: underline;
  cursor: pointer;
`;

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-top: 0.5rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  
  &:before {
    content: '>';
    color: ${({ theme }) => theme.colors.prompt};
    margin-right: 0.75rem;
    font-weight: bold;
  }
`;

const SectionTitle = styled.div`
  color: ${({ theme }) => theme.colors.prompt};
  font-weight: bold;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProjectTitle = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.command};
`;

const TechStack = styled.span`
  color: ${({ theme }) => theme.colors.result};
  font-size: 0.9em;
  font-style: italic;
  margin-left: 0.5rem;
`;

// Helper to format text with newlines
const TextBlock = ({ children }: { children: React.ReactNode }) => (
  <div style={{ lineHeight: '1.6', marginBottom: '1rem' }}>{children}</div>
);

export const commands: Record<string, Command> = {
  help: {
    cmd: 'help',
    desc: 'List available commands',
    action: () => (
      <div>
        <TextBlock>Available commands:</TextBlock>
        <List>
          {Object.values(commands).map((cmd) => (
            <ListItem key={cmd.cmd}>
              <strong style={{ minWidth: '100px', display: 'inline-block' }}>{cmd.cmd}</strong>
              {cmd.desc}
            </ListItem>
          ))}
        </List>
      </div>
    ),
  },
  about: {
    cmd: 'about',
    desc: 'Learn about me',
    action: () => (
      <div>
        <TextBlock>
          Hi! I'm <strong>Francis Escares Padua</strong>.
        </TextBlock>
        <TextBlock>
          I'm a Computer Science student at the <strong>University of California, Irvine</strong> (Class of 2027), 
          maintaining a 3.9 GPA. I have a strong background in software development and infrastructure engineering, 
          with a passion for building robust systems and exploring cybersecurity.
        </TextBlock>
        <TextBlock>
          Currently, I work as a Software Developer for <strong>AntAlmanac</strong> and an Infrastructure Engineer for <strong>Cyber@UCI</strong>.
        </TextBlock>
      </div>
    ),
  },
  experience: {
    cmd: 'experience',
    desc: 'View my professional experience',
    action: () => (
      <div>
        <SectionTitle>Software Developer @ AntAlmanac</SectionTitle>
        <div style={{ marginBottom: '0.5rem', opacity: 0.8 }}>Nov 2025 -- Present | Irvine, CA</div>
        <List>
          <ListItem>Optimized search latency by 30% by implementing constant-time lookups in TypeScript, serving 17,000 users.</ListItem>
          <ListItem>Developed features to visualize course availability using React/MUI, improving user navigation experience.</ListItem>
          <ListItem>Automated data processing latency using Typescript and Github Actions CI/CD reducing latency to &lt;60 minutes.</ListItem>
        </List>

        <SectionTitle>Infrastructure Engineer @ Cyber@UCI</SectionTitle>
        <div style={{ marginBottom: '0.5rem', opacity: 0.8 }}>Nov 2025 -- Present | Irvine, CA</div>
        <List>
          <ListItem>Deployed virtualization environments using Proxmox and Cloud-init to replicate complex network topologies.</ListItem>
          <ListItem>Engineered virtual machines hosting diverse open-source services including Kubernetes, Docker, and Apache.</ListItem>
          <ListItem>Developed internal tooling and scripts using Bash, Go, and Ansible to automate manual competition workflows.</ListItem>
        </List>
      </div>
    ),
  },
  projects: {
    cmd: 'projects',
    desc: 'View my technical projects',
    action: () => (
      <div>
        <ListItem>
          <div>
            <div>
              <ProjectTitle>Northstar</ProjectTitle>
              <TechStack>[Go, React, TypeScript, ConnectRPC, SQLite]</TechStack>
            </div>
            <div style={{ marginTop: '0.25rem' }}>
              Engineered a self-contained binary using Go and Vite enabling instant deployment on air-gapped Linux hosts.
              Architected a type-safe backend with ConnectRPC and GORM.
            </div>
          </div>
        </ListItem>
        <ListItem>
          <div>
            <div>
              <ProjectTitle>Phoenix</ProjectTitle>
              <TechStack>[Go, MCP, ConnectRPC]</TechStack>
            </div>
            <div style={{ marginTop: '0.25rem' }}>
              Engineered a custom MCP server connecting Northstar to Claude Code enabling autonomous agentic workflows.
              Bridged the gap between AI agents and air-gapped infrastructure.
            </div>
          </div>
        </ListItem>
        <ListItem>
          <div>
            <div>
              <ProjectTitle>Cointegration Analyzer</ProjectTitle>
              <TechStack>[C++, Python, Pandas]</TechStack>
            </div>
            <div style={{ marginTop: '0.25rem' }}>
              Pipeline analyzing 10,000 stock pairs for statistical arbitrage. Reduced computational overhead by 60% with C++.
            </div>
          </div>
        </ListItem>
      </div>
    ),
  },
  skills: {
    cmd: 'skills',
    desc: 'View my technical skills',
    action: () => (
      <div>
        <SectionTitle>Languages</SectionTitle>
        <div>Go, C++, Python, TypeScript, JavaScript, SQL, Bash</div>
        
        <SectionTitle>Frameworks</SectionTitle>
        <div>React, Tailwind CSS, MUI, ConnectRPC, GORM, Node.js, Next.js, tRPC, Vite</div>
        
        <SectionTitle>Infrastructure</SectionTitle>
        <div>Kubernetes, Docker, Ansible, Proxmox, GitHub Actions, Linux, Nginx</div>
        
        <SectionTitle>Tools & Data</SectionTitle>
        <div>Protocol Buffers, SQLite, PostgreSQL, MySQL, pandas, NumPy</div>
      </div>
    ),
  },
  education: {
    cmd: 'education',
    desc: 'View my education',
    action: () => (
      <div>
        <SectionTitle>University of California, Irvine</SectionTitle>
        <div>B.S. in Computer Science (GPA 3.9/4.0)</div>
        <div style={{ opacity: 0.8 }}>Expected June 2027</div>

        <SectionTitle>Fullerton College</SectionTitle>
        <div>Computer Science (GPA 4.0/4.0)</div>
        <div style={{ opacity: 0.8 }}>Sept 2023 -- June 2025</div>
      </div>
    ),
  },
  competitions: {
    cmd: 'competitions',
    desc: 'View competition achievements',
    action: () => (
      <div>
        <SectionTitle>Western Regional Collegiate Cyber Defense Competition</SectionTitle>
        <div style={{ marginBottom: '0.5rem' }}><strong>1st Place</strong> (vs. 30 Teams) | Nov 2025 -- Present</div>
        <List>
          <ListItem>Secured critical Linux services within Kubernetes/Docker while defending against adversaries.</ListItem>
          <ListItem>Orchestrated incident response workflows utilizing Claude Code (Phoenix).</ListItem>
        </List>
      </div>
    ),
  },
  contact: {
    cmd: 'contact',
    desc: 'Get in touch',
    action: () => (
      <div>
        <TextBlock>Feel free to reach out!</TextBlock>
        <List>
          <ListItem>Email: <Link href="mailto:paduaf@uci.edu">paduaf@uci.edu</Link></ListItem>
          <ListItem>LinkedIn: <Link href="https://linkedin.com/in/francis-e-padua" target="_blank">linkedin.com/in/francis-e-padua</Link></ListItem>
          <ListItem>GitHub: <Link href="https://github.com/sicn4rf" target="_blank">github.com/sicn4rf</Link></ListItem>
          <ListItem>Phone: +1 661-844-0230</ListItem>
        </List>
      </div>
    ),
  },
  clear: {
    cmd: 'clear',
    desc: 'Clear the terminal output',
    action: () => '', // Handled specially in the terminal component
  },
};
