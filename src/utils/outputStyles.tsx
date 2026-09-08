import styled from 'styled-components';

/** Styled primitives shared by every command's output. */

export const Link = styled.a`
  color: ${({ theme }) => theme.colors.link};
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
`;

export const SectionTitle = styled.div`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.15rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 0.85em;

  &:first-child {
    margin-top: 0;
  }
`;

export const Muted = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;

export const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin: 0.4rem 0 0;
`;

export const ListItem = styled.li`
  margin-bottom: 0.35rem;
  display: flex;
  align-items: flex-start;

  &:before {
    content: '›';
    color: ${({ theme }) => theme.colors.prompt};
    margin-right: 0.75rem;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

export const Pre = styled.pre`
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.45;
  white-space: pre;
  overflow-x: auto;
`;

export const Meta = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9em;
  margin-top: 0.1rem;
`;

export const Title = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.command};
`;

export const Stack = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9em;
  margin-left: 0.5rem;
`;

/* ── Table output, for the kubectl/helm/argocd family ───────────────────── */

export const Table = styled.div`
  display: grid;
  gap: 0 2ch;
  font-variant-numeric: tabular-nums;
  overflow-x: auto;
  padding-bottom: 2px;
`;

export const HeaderCell = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  font-size: 0.85em;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

export const Cell = styled.span`
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.result};
`;

/** Colours the health words kubectl and friends emit. */
export const StatusCell = styled(Cell)<{ $status: string }>`
  color: ${({ theme, $status }) => {
    const s = $status.toLowerCase();
    if (['running', 'ready', 'healthy', 'synced', 'deployed', 'active', 'up'].includes(s))
      return theme.colors.green;
    if (['completed', 'succeeded', 'cordoned'].includes(s)) return theme.colors.blue;
    if (['pending', 'progressing', 'outofsync', 'degraded', 'notready'].includes(s))
      return theme.colors.yellow;
    if (['failed', 'crashloopbackoff', 'error', 'missing'].includes(s)) return theme.colors.red;
    return theme.colors.result;
  }};
`;

interface TableProps {
  columns: string[];
  rows: string[][];
  /** Index of the column whose value should be colour-coded by health. */
  statusColumn?: number;
}

export const DataTable = ({ columns, rows, statusColumn }: TableProps) => (
  <Table style={{ gridTemplateColumns: `repeat(${columns.length}, max-content)` }}>
    {columns.map(c => (
      <HeaderCell key={c}>{c}</HeaderCell>
    ))}
    {rows.map((row, r) =>
      row.map((value, c) =>
        c === statusColumn ? (
          <StatusCell key={`${r}-${c}`} $status={value}>
            {value}
          </StatusCell>
        ) : (
          <Cell key={`${r}-${c}`}>{value}</Cell>
        ),
      ),
    )}
  </Table>
);
