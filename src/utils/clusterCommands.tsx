/**
 * The portfolio, modelled as a Kubernetes cluster.
 *
 * Every command here returns plausible output whose *content* is the résumé —
 * the roles are pods, the institutions are nodes, the projects are Helm
 * releases. An easter egg should teach you something true.
 */
import type { Command } from '../types';
import { experience, projects } from './content';
import { panelData } from './panelData';
import { DataTable, Muted, Pre, SectionTitle } from './outputStyles';

/* ── Cluster state ──────────────────────────────────────────────────────── */

interface Pod {
  name: string;
  ready: string;
  status: string;
  restarts: string;
  age: string;
  namespace: string;
  /** Key into panelData, so `describe` can open the side pane. */
  panel?: string;
  node: string;
  image: string;
  logs: string[];
}

export const PODS: Pod[] = [
  {
    name: 'antalmanac-5f9c6d8b3-qr4tz',
    ready: '3/3',
    status: 'Running',
    restarts: '0',
    age: '312d',
    namespace: 'work',
    panel: 'antalmanac',
    node: 'uci-irvine',
    image: 'ghcr.io/icssc/antalmanac:v4.2.1',
    logs: [
      'INFO  scheduler   precomputed availability index in 41ms (17,204 sections)',
      'INFO  http        GET /api/v1/courses?term=2026F 200 12ms',
      'INFO  release     quarterly course-data sync complete — 0 manual PRs',
      'INFO  ws          4,918 clients subscribed to live enrollment',
    ],
  },
  {
    name: 'cyberuci-defense-0',
    ready: '1/1',
    status: 'Running',
    restarts: '14',
    age: '312d',
    namespace: 'work',
    panel: 'cyberuci',
    node: 'uci-irvine',
    image: 'cyberuci/blue-team:nccdc-2026',
    logs: [
      'WARN  auditd      unexpected setuid binary /tmp/.cache/nc — quarantined',
      'INFO  ansible     playbook harden-ssh.yml: 23 changed, 0 unreachable',
      'WARN  scoring     http/1 service DOWN 41s — restored',
      'INFO  auditd      removed 3 unauthorized authorized_keys entries',
      'INFO  firewall    default-deny applied across 50 services',
    ],
  },
  {
    name: 'resmed-platform-8c7d5e9a1',
    ready: '0/1',
    status: 'Completed',
    restarts: '0',
    age: '71d',
    namespace: 'work',
    panel: 'resmed',
    node: 'resmed-san-diego',
    image: 'resmed/platform-intern:summer-2026',
    logs: [
      'INFO  scanner     analyzed 63 workflows — 11 shell-injection findings',
      'INFO  transpiler  intent.yaml -> values.yaml validated by Zod schema',
      'INFO  argocd      application "svc-gateway" Synced in 5.0s (was 5m02s)',
      'INFO  lifecycle   internship complete — exit code 0',
    ],
  },
  {
    name: 'northstar-7d4b8c9f5-x2kqp',
    ready: '1/1',
    status: 'Running',
    restarts: '0',
    age: '243d',
    namespace: 'projects',
    panel: 'northstar',
    node: 'uci-irvine',
    image: 'sicn4rf/northstar:1.4.2',
    logs: [
      'INFO  server      single binary up — UI + SQLite embedded, 0 external deps',
      'INFO  ws          buffered channel drained, telemetry lag 0ms',
      'INFO  vault       credential store holds 0 passwords by design',
      'INFO  hosts       18 agents reporting healthy',
    ],
  },
  {
    name: 'hypernova-6b8f7d4c2-mn8vw',
    ready: '1/1',
    status: 'Running',
    restarts: '2',
    age: '212d',
    namespace: 'projects',
    panel: 'hypernova',
    node: 'uci-irvine',
    image: 'sicn4rf/hypernova:0.9.0',
    logs: [
      'INFO  mcp         tool "parse_auth_log" called by agent — 1.2s',
      'INFO  mcp         tool "run_playbook" requires approval — awaiting operator',
      'INFO  mcp         credential resolved by index ref #3 (never in context)',
      'INFO  mcp         approval granted — playbook harden-ssh.yml dispatched',
    ],
  },
  {
    name: 'portfolio-term-9f2a4b6c8',
    ready: '1/1',
    status: 'Running',
    restarts: '0',
    age: '1m',
    namespace: 'default',
    node: 'vercel-edge',
    image: 'sicn4rf/portfolio-term:2.0.0',
    logs: [
      'INFO  vite        build complete in 612ms',
      'INFO  term        session started — you are here',
    ],
  },
];

const NODES = [
  ['uci-irvine', 'Ready', 'control-plane', '3y', 'v1.32.0'],
  ['resmed-san-diego', 'Cordoned', '<none>', '71d', 'v1.31.4'],
  ['csuf-fullerton', 'Cordoned', '<none>', '1y', 'v1.29.8'],
  ['vercel-edge', 'Ready', '<none>', '1m', 'v1.32.0'],
];

const findPod = (query: string): Pod | undefined =>
  PODS.find(p => p.name === query) ??
  PODS.find(p => p.name.startsWith(query)) ??
  PODS.find(p => p.name.split('-')[0] === query);

const podNames = () => PODS.map(p => p.name.split('-')[0]).join(', ');

/* ── kubectl ────────────────────────────────────────────────────────────── */

const getResource = (resource: string, args: string[]) => {
  const allNamespaces = args.includes('-A') || args.includes('--all-namespaces');

  if (/^pods?$/.test(resource) || resource === 'po') {
    // Everything lives in one visible cluster here; -A only adds the column.
    return (
      <DataTable
        columns={
          allNamespaces
            ? ['NAMESPACE', 'NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE']
            : ['NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE']
        }
        statusColumn={allNamespaces ? 3 : 2}
        rows={PODS.map(p =>
          allNamespaces
            ? [p.namespace, p.name, p.ready, p.status, p.restarts, p.age]
            : [p.name, p.ready, p.status, p.restarts, p.age],
        )}
      />
    );
  }

  if (/^nodes?$/.test(resource) || resource === 'no') {
    return (
      <DataTable
        columns={['NAME', 'STATUS', 'ROLES', 'AGE', 'VERSION']}
        statusColumn={1}
        rows={NODES}
      />
    );
  }

  if (/^(deployments?|deploy)$/.test(resource)) {
    return (
      <DataTable
        columns={['NAME', 'READY', 'UP-TO-DATE', 'AVAILABLE', 'AGE']}
        rows={[
          ['antalmanac', '3/3', '3', '3', '312d'],
          ['northstar', '1/1', '1', '1', '243d'],
          ['hypernova', '1/1', '1', '1', '212d'],
          ['portfolio-term', '1/1', '1', '1', '1m'],
        ]}
      />
    );
  }

  if (/^(namespaces?|ns)$/.test(resource)) {
    return (
      <DataTable
        columns={['NAME', 'STATUS', 'AGE']}
        statusColumn={1}
        rows={[
          ['default', 'Active', '3y'],
          ['work', 'Active', '312d'],
          ['projects', 'Active', '243d'],
          ['kube-system', 'Active', '3y'],
        ]}
      />
    );
  }

  if (/^(services?|svc)$/.test(resource)) {
    return (
      <DataTable
        columns={['NAME', 'TYPE', 'CLUSTER-IP', 'PORT(S)', 'AGE']}
        rows={[
          ['antalmanac', 'ClusterIP', '10.96.4.18', '443/TCP', '312d'],
          ['northstar', 'ClusterIP', '10.96.7.201', '8080/TCP', '243d'],
          ['hypernova', 'ClusterIP', '10.96.7.244', '9090/TCP', '212d'],
          ['portfolio-term', 'LoadBalancer', '10.96.0.12', '443/TCP', '1m'],
        ]}
      />
    );
  }

  return `error: the server doesn't have a resource type "${resource}"`;
};

const describePod = (query: string, openPanel: (c: (typeof panelData)[string]) => void) => {
  const pod = findPod(query);
  if (!pod) return `Error from server (NotFound): pods "${query}" not found`;

  const role = experience.find(r => r.id === pod.panel);
  const project = projects.find(p => p.id === pod.panel);
  const bullets = role?.bullets ?? project?.bullets ?? [];

  if (pod.panel && panelData[pod.panel]) openPanel(panelData[pod.panel]);

  return (
    <div>
      <Pre>
        {[
          `Name:             ${pod.name}`,
          `Namespace:        ${pod.namespace}`,
          `Node:             ${pod.node}`,
          `Status:           ${pod.status}`,
          `Image:            ${pod.image}`,
          `Restart Count:    ${pod.restarts}`,
          `Age:              ${pod.age}`,
        ].join('\n')}
      </Pre>
      {bullets.length > 0 && (
        <>
          <SectionTitle>Events</SectionTitle>
          <Pre>
            {bullets.map(b => `  Normal   Shipped   ${b}`).join('\n')}
          </Pre>
        </>
      )}
      <Muted>
        <br />
        Opened the details pane. Ctrl-p toggles it.
      </Muted>
    </div>
  );
};

const kubectl: Command['action'] = (args, ctx) => {
  const [verb, ...rest] = args;

  switch (verb) {
    case undefined:
    case 'help':
      return (
        <Pre>
          {[
            'kubectl controls the portfolio cluster.',
            '',
            'Basic Commands:',
            '  get         Display one or many resources (pods, nodes, deploy, svc, ns)',
            '  describe    Show details of a specific pod',
            '  logs        Print the logs for a pod',
            '  config      Modify kubeconfig files',
            '  version     Print the client and server version',
            '',
            `Pods: ${podNames()}`,
          ].join('\n')}
        </Pre>
      );

    case 'get':
      if (!rest[0]) return 'error: You must specify the type of resource to get.';
      return getResource(rest[0], rest.slice(1));

    case 'describe':
      if (rest[0] === 'pod' || rest[0] === 'pods') {
        return rest[1]
          ? describePod(rest[1], ctx.openSidePanel)
          : 'error: You must specify a pod name.';
      }
      return rest[0]
        ? describePod(rest[0], ctx.openSidePanel)
        : 'error: You must specify a resource.';

    case 'logs': {
      const pod = findPod(rest.find(a => !a.startsWith('-')) ?? '');
      if (!pod) return `Error from server (NotFound): pods "${rest[0] ?? ''}" not found`;
      return (
        <Pre>
          {pod.logs.map(l => `${l}`).join('\n')}
          {rest.includes('-f') || rest.includes('--follow') ? '\n^C' : ''}
        </Pre>
      );
    }

    case 'config':
      if (rest[0] === 'get-contexts' || rest[0] === 'current-context') {
        return rest[0] === 'current-context' ? (
          'portfolio-prod'
        ) : (
          <DataTable
            columns={['CURRENT', 'NAME', 'CLUSTER', 'NAMESPACE']}
            rows={[
              ['*', 'portfolio-prod', 'portfolio-prod', 'default'],
              ['', 'homelab', 'proxmox-homelab', 'default'],
              ['', 'nccdc-range', 'nccdc-range', 'blue'],
            ]}
          />
        );
      }
      return 'Usage: kubectl config get-contexts | current-context';

    case 'version':
      return (
        <Pre>
          {[
            'Client Version: v1.32.0',
            'Kustomize Version: v5.5.0',
            'Server Version: v1.32.0',
          ].join('\n')}
        </Pre>
      );

    case 'apply':
    case 'delete':
    case 'edit':
    case 'scale':
      return `Error from server (Forbidden): ${verb} is forbidden: User "visitor" cannot ${verb} resources in the cluster scope`;

    default:
      return `error: unknown command "${verb}" for "kubectl"\n\nRun 'kubectl help' for usage.`;
  }
};

/* ── The rest of the platform toolchain ─────────────────────────────────── */

export const clusterCommands: Record<string, Command> = {
  kubectl: {
    cmd: 'kubectl',
    desc: 'Control the portfolio cluster',
    action: kubectl,
  },

  k: {
    cmd: 'k',
    desc: 'Alias for kubectl',
    action: kubectl,
  },

  helm: {
    cmd: 'helm',
    desc: 'The Kubernetes package manager',
    action: args => {
      if (args[0] === 'list' || args[0] === 'ls') {
        return (
          <DataTable
            columns={['NAME', 'NAMESPACE', 'REVISION', 'UPDATED', 'STATUS', 'CHART', 'APP VERSION']}
            statusColumn={4}
            rows={[
              ['antalmanac', 'work', '48', '2026-08-30', 'deployed', 'antalmanac-4.2.1', '4.2.1'],
              ['northstar', 'projects', '7', '2026-01-18', 'deployed', 'northstar-1.4.2', '1.4.2'],
              ['hypernova', 'projects', '3', '2026-02-24', 'deployed', 'hypernova-0.9.0', '0.9.0'],
              ['portfolio', 'default', '1', '2026-09-08', 'deployed', 'portfolio-2.0.0', '2.0.0'],
            ]}
          />
        );
      }

      if (args[0] === 'get' && args[1] === 'values') {
        return (
          <div>
            <Muted>USER-SUPPLIED VALUES:</Muted>
            <Pre>
              {[
                '# The Resmed work in one file: engineers describe intent, a',
                '# TypeScript/Zod transpiler turns it into Helm values for EKS.',
                'intent:',
                '  name: svc-gateway',
                '  tier: production',
                '  traffic: public',
                '  availability: multi-az',
                '  data: none',
                '',
                '# ...becomes:',
                'replicaCount: 6',
                'topologySpreadConstraints:',
                '  - maxSkew: 1',
                '    topologyKey: topology.kubernetes.io/zone',
                '    whenUnsatisfiable: DoNotSchedule',
                'gateway:',
                '  className: envoy-gateway',
                '  tls: { mode: Terminate }',
                'podSecurityContext:',
                '  runAsNonRoot: true',
                '  seccompProfile: { type: RuntimeDefault }',
              ].join('\n')}
            </Pre>
          </div>
        );
      }

      if (args[0] === 'repo') {
        return (
          <DataTable
            columns={['NAME', 'URL']}
            rows={[
              ['bitnami', 'https://charts.bitnami.com/bitnami'],
              ['argo', 'https://argoproj.github.io/argo-helm'],
              ['kyverno', 'https://kyverno.github.io/kyverno'],
            ]}
          />
        );
      }

      return 'Usage: helm list | helm get values <release> | helm repo list';
    },
  },

  argocd: {
    cmd: 'argocd',
    desc: 'GitOps continuous delivery',
    action: args => {
      if (args[0] === 'app' && (args[1] === 'list' || !args[1])) {
        return (
          <DataTable
            columns={['NAME', 'CLUSTER', 'NAMESPACE', 'STATUS', 'HEALTH', 'SYNCPOLICY']}
            statusColumn={3}
            rows={[
              ['portfolio', 'in-cluster', 'default', 'Synced', 'Healthy', 'Auto-Prune'],
              ['antalmanac', 'in-cluster', 'work', 'Synced', 'Healthy', 'Auto-Prune'],
              ['northstar', 'in-cluster', 'projects', 'Synced', 'Healthy', 'Auto'],
              ['hypernova', 'in-cluster', 'projects', 'OutOfSync', 'Healthy', 'Manual'],
            ]}
          />
        );
      }

      if (args[0] === 'app' && args[1] === 'sync') {
        return (
          <Pre>
            {[
              `TIMESTAMP                  GROUP        KIND    NAMESPACE   NAME     STATUS    HEALTH`,
              `2026-09-08T12:00:00Z       apps    Deployment    projects   ${args[2] ?? 'hypernova'}   Synced   Healthy`,
              '',
              'Sync completed in 5.0s.',
              '',
              'Before the GitOps layer this took 5 minutes. That delta is the whole',
              'point — it is the difference between deploying when you are ready and',
              'deploying when you are brave.',
            ].join('\n')}
          </Pre>
        );
      }

      return 'Usage: argocd app list | argocd app sync <app>';
    },
  },

  aws: {
    cmd: 'aws',
    desc: 'AWS CLI',
    action: args => {
      if (args[0] === 'eks' && args[1] === 'list-clusters') {
        return (
          <Pre>
            {JSON.stringify(
              { clusters: ['platform-prod-usw2', 'platform-stage-usw2', 'platform-dev-usw2'] },
              null,
              4,
            )}
          </Pre>
        );
      }
      if (args[0] === 'sts' && args[1] === 'get-caller-identity') {
        return (
          <Pre>
            {JSON.stringify(
              {
                UserId: 'AIDAVISITOR000000000',
                Account: '000000000000',
                Arn: 'arn:aws:iam::000000000000:user/visitor',
              },
              null,
              4,
            )}
          </Pre>
        );
      }
      return 'Usage: aws eks list-clusters | aws sts get-caller-identity';
    },
  },

  docker: {
    cmd: 'docker',
    desc: 'Container runtime',
    action: args => {
      if (args[0] === 'ps') {
        return (
          <DataTable
            columns={['CONTAINER ID', 'IMAGE', 'STATUS', 'PORTS', 'NAMES']}
            statusColumn={2}
            rows={PODS.slice(0, 4).map((p, i) => [
              (0xa3f2b81c + i * 0x1d3).toString(16).slice(0, 12),
              p.image,
              p.status === 'Completed' ? 'Exited' : 'Up',
              '—',
              p.name.split('-')[0],
            ])}
          />
        );
      }
      return 'Usage: docker ps';
    },
  },

  kyverno: {
    cmd: 'kyverno',
    desc: 'Policy engine',
    action: () => (
      <DataTable
        columns={['POLICY', 'BACKGROUND', 'ACTION', 'READY']}
        statusColumn={3}
        rows={[
          ['disallow-privileged', 'true', 'Enforce', 'Ready'],
          ['require-run-as-nonroot', 'true', 'Enforce', 'Ready'],
          ['restrict-image-registries', 'true', 'Enforce', 'Ready'],
          ['require-resource-limits', 'true', 'Audit', 'Ready'],
        ]}
      />
    ),
  },

  terraform: {
    cmd: 'terraform',
    desc: 'Infrastructure as code',
    action: args => {
      if (args[0] === 'plan' || !args[0]) {
        return (
          <Pre>
            {[
              'Terraform used the selected providers to generate the following',
              'execution plan.',
              '',
              'No changes. Your infrastructure matches the configuration.',
              '',
              'Plan: 0 to add, 0 to change, 0 to destroy.',
            ].join('\n')}
          </Pre>
        );
      }
      if (args[0] === 'destroy') {
        return 'Error: this is a portfolio. Try `terraform plan`.';
      }
      return 'Usage: terraform plan';
    },
  },
};
