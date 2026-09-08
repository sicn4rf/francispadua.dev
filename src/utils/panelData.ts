import type { SidePanelContent } from '../types';
import {
  profile,
  experience,
  projects,
  awards,
  skills,
  now,
  interests,
} from './content';

/**
 * Presentation for the side pane: which image belongs to which entry, and
 * which devicon glyph belongs to which skill. The words themselves live in
 * content.ts — nothing here should restate a fact.
 */

const devicon = (name: string, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;

/**
 * Devicon has no glyph for several of these — Kyverno, Envoy Gateway,
 * Gravitee, Proxmox, Drizzle — so they are simply absent from the map and
 * render as bare labels. `OptionalIcon` also hides anything that 404s, so an
 * optimistic guess here degrades quietly rather than breaking the row.
 */
const SKILL_ICONS: Record<string, string> = {
  Go: devicon('go', 'original-wordmark'),
  'C++': devicon('cplusplus'),
  Python: devicon('python'),
  TypeScript: devicon('typescript'),
  JavaScript: devicon('javascript'),
  SQL: devicon('azuresqldatabase'),
  Bash: devicon('bash'),

  React: devicon('react'),
  'Next.js': devicon('nextjs'),
  'Node.js': devicon('nodejs'),
  Vite: devicon('vitejs'),
  MUI: devicon('materialui'),
  'Tailwind CSS': devicon('tailwindcss'),
  Protobuf: devicon('protobuf'),

  Kubernetes: devicon('kubernetes'),
  Helm: devicon('helm'),
  ArgoCD: devicon('argocd'),
  'AWS EKS': devicon('amazonwebservices', 'original-wordmark'),
  Ansible: devicon('ansible'),
  'GitHub Actions': devicon('githubactions'),
};

/**
 * Local files under public/images. Anything not yet committed falls back to
 * the dashed placeholder at render time, so adding the file is the only step
 * needed to make it appear.
 */
const IMAGES = {
  profile: '/images/about-profile.jpg',
  sf: '/images/about-sf.jpg',
  nightHike: '/images/about-night.jpg',
  matcha: ['/images/matcha-1.jpg', '/images/matcha-2.jpg', '/images/matcha-3.jpg'],
  antalmanac: '/images/antalmanac-preview.png',
  northstar: '/images/northstar-preview.png',
  hypernova: '/images/hypernova-preview.png',
  resmed: '/images/resmed.jpg',
  cyberuci: 'https://avatars.githubusercontent.com/u/113885024?s=200&v=4',
  wrccdc: 'https://wrccdc.org/images/logo2026-34.png',
};

const ROLE_IMAGES: Record<string, string> = {
  antalmanac: IMAGES.antalmanac,
  cyberuci: IMAGES.cyberuci,
  resmed: IMAGES.resmed,
};

const PROJECT_IMAGES: Record<string, string> = {
  northstar: IMAGES.northstar,
  hypernova: IMAGES.hypernova,
};

const fromRoles: Record<string, SidePanelContent> = Object.fromEntries(
  experience.map(r => [
    r.id,
    {
      title: r.org,
      subtitle: `${r.title} · ${r.start} — ${r.end}`,
      sections: [
        ...(ROLE_IMAGES[r.id]
          ? [{ data: { kind: 'image' as const, alt: r.org, src: ROLE_IMAGES[r.id] } }]
          : []),
        ...(r.links ? [{ label: 'Links', data: { kind: 'links' as const, items: r.links } }] : []),
        { data: { kind: 'text' as const, content: r.blurb } },
        {
          label: 'Highlights',
          data: { kind: 'text' as const, content: r.bullets.map(b => `— ${b}`).join('\n\n') },
        },
      ],
    },
  ]),
);

const fromProjects: Record<string, SidePanelContent> = Object.fromEntries(
  projects.map(p => [
    p.id,
    {
      title: p.name,
      subtitle: `${p.date} · ${p.stack.join(', ')}`,
      sections: [
        ...(PROJECT_IMAGES[p.id]
          ? [{ data: { kind: 'image' as const, alt: `${p.name} preview`, src: PROJECT_IMAGES[p.id] } }]
          : []),
        ...(p.links ? [{ label: 'Links', data: { kind: 'links' as const, items: p.links } }] : []),
        { data: { kind: 'text' as const, content: p.blurb } },
        {
          label: 'Stack',
          data: {
            kind: 'tags' as const,
            items: p.stack.map(label => ({ label, icon: SKILL_ICONS[label] })),
          },
        },
      ],
    },
  ]),
);

const fromSkills: Record<string, SidePanelContent> = Object.fromEntries(
  Object.entries(skills).map(([group, items]) => [
    `skills.${group.toLowerCase()}`,
    {
      title: group,
      subtitle: `${items.length} entries`,
      sections: [
        {
          data: {
            kind: 'tags' as const,
            items: items.map(label => ({ label, icon: SKILL_ICONS[label] })),
          },
        },
      ],
    },
  ]),
);

export const panelData: Record<string, SidePanelContent> = {
  ...fromRoles,
  ...fromProjects,
  ...fromSkills,

  about: {
    title: profile.name,
    subtitle: profile.subtitle,
    sections: [
      { data: { kind: 'image', alt: 'Francis Padua', src: IMAGES.profile } },
      { data: { kind: 'text', content: profile.bio.join('\n\n') } },
      {
        label: 'Links',
        data: {
          kind: 'links',
          items: [
            { label: profile.linkedin, url: `https://${profile.linkedin}` },
            { label: profile.github, url: `https://${profile.github}` },
            { label: profile.email, url: `mailto:${profile.email}` },
          ],
        },
      },
      {
        label: 'Outside of work',
        data: { kind: 'tags', items: interests.map(label => ({ label })) },
      },
      {
        label: 'Photos',
        data: {
          kind: 'gallery',
          items: [
            { alt: 'SF Park', src: IMAGES.sf },
            { alt: 'Night Hike', src: IMAGES.nightHike },
          ],
        },
      },
      {
        label: 'Matcha Collection',
        data: {
          kind: 'gallery',
          items: IMAGES.matcha.map((src, i) => ({ alt: `Matcha ${i + 1}`, src })),
        },
      },
    ],
  },

  awards: {
    title: 'Collegiate Cyber Defense',
    subtitle: '2026 season',
    sections: [
      { data: { kind: 'image', alt: 'WRCCDC', src: IMAGES.wrccdc } },
      {
        data: {
          kind: 'text',
          content: awards
            .map(a => `${a.name}\n${a.date}\n${a.placements.map(p => `— ${p}`).join('\n')}`)
            .join('\n\n'),
        },
      },
      {
        label: 'What the competition is',
        data: {
          kind: 'text',
          content:
            'Eight students defend a small enterprise network — Linux and Windows services, all of it deliberately misconfigured — against a professional red team, while a scoring engine checks uptime and injects business tasks on a timer. You cannot take a service down to fix it.',
        },
      },
    ],
  },

  now: {
    title: 'Now',
    subtitle: 'Updated September 2026',
    sections: Object.entries(now).map(([label, items]) => ({
      label,
      data: { kind: 'text' as const, content: items.map(i => `— ${i}`).join('\n') },
    })),
  },

  'now.reading': {
    title: 'Reading',
    sections: [
      {
        data: {
          kind: 'gallery',
          items: [
            {
              alt: 'Atomic Habits',
              src: 'https://covers.openlibrary.org/b/isbn/0735211299-L.jpg',
            },
          ],
        },
      },
      { data: { kind: 'text', content: now.Reading.join('\n') } },
    ],
  },

  'now.watching': {
    title: 'Watching',
    sections: [
      {
        data: {
          kind: 'gallery',
          items: [
            {
              alt: 'Jujutsu Kaisen S3',
              src: 'https://cdn.myanimelist.net/images/anime/1659/154920l.jpg',
            },
            {
              alt: 'My Hero Academia',
              src: 'https://cdn.myanimelist.net/images/anime/10/78745l.jpg',
            },
            {
              alt: 'Fullmetal Alchemist: Brotherhood',
              src: 'https://cdn.myanimelist.net/images/anime/1208/94745l.jpg',
            },
          ],
        },
      },
    ],
  },
};
