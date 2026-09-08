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

/** Side-pane content, derived from the résumé data so the two cannot drift. */
const fromRoles: Record<string, SidePanelContent> = Object.fromEntries(
  experience.map(r => [
    r.id,
    {
      title: r.org,
      subtitle: `${r.title} · ${r.start} — ${r.end}`,
      sections: [
        ...(r.links ? [{ label: 'Links', data: { kind: 'links' as const, items: r.links } }] : []),
        { data: { kind: 'text' as const, content: r.blurb } },
        { label: 'Highlights', data: { kind: 'text' as const, content: r.bullets.map(b => `— ${b}`).join('\n\n') } },
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
        ...(p.links ? [{ label: 'Links', data: { kind: 'links' as const, items: p.links } }] : []),
        { data: { kind: 'text' as const, content: p.blurb } },
        { label: 'Stack', data: { kind: 'tags' as const, items: p.stack.map(label => ({ label })) } },
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
      sections: [{ data: { kind: 'tags' as const, items: items.map(label => ({ label })) } }],
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
      { label: 'Outside of work', data: { kind: 'tags', items: interests.map(label => ({ label })) } },
    ],
  },

  awards: {
    title: 'Collegiate Cyber Defense',
    subtitle: '2026 season',
    sections: [
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
};
