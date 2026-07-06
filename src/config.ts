export const config = {
  // My Infos
  displayName: 'Krex' as const,
  subtitle: 'Network Engineer · Backend Developer · Austria' as const,
  dateOfBirth: '2009-04-01T00:00:00Z' as const,
  location: 'Austria / Vienna' as const,
  country: 'Austria' as const,
  web3formsAccessKey: '1e740942-80db-4c1d-9355-1e96de939c64'  as const,

  // IDs
  discord: {
    id: '699386102066446346' as const,
  },
  github: {
    username: 'Krex381' as const,
  },

  // Social links
  socials: [
    {
      name: 'GitHub' as const,
      url: 'https://github.com/Krex381' as const,
      handle: '@Krex381' as const,
      description: 'Open source projects and code' as const,
    },
    {
      name: 'Discord' as const,
      url: 'https://discord.com/users/699386102066446346' as const,
      handle: 'krexizm.' as const,
      description: 'Community and chat' as const,
    },
    {
      name: 'Telegram' as const,
      url: 'https://t.me/krexizm' as const,
      handle: '@krexizm' as const,
      description: 'Direct messages' as const,
    },
    {
      name: 'Instagram' as const,
      url: 'https://instagram.com/werzyizm' as const,
      handle: '@werzyizm' as const,
      description: 'Instagram Profile' as const,
    },
  ],

  // Repos to exclude from Work page (e.g. portfolio repo)
  excludeRepos: ['Krex381'] as string[],

  // Skills
  skills: [
    { category: 'Network Engineering', tags: ['Cisco', 'MikroTik', 'WireGuard', 'Nginx'] },
    { category: 'Backend Development', tags: ['Go', 'Python', 'Node.js', 'Firebase'] },
    { category: 'Security', tags: ['Nmap', 'Wireshark', 'JA3', 'OSINT'] },
    { category: 'Databases', tags: ['PostgreSQL', 'SQLite', 'MongoDB', 'Redis'] },
    { category: 'Scripting', tags: ['Bash', 'PowerShell', 'Python'] },
    { category: 'DevOps', tags: ['Docker', 'Linux', 'CI/CD'] },
  ] as const,

  // Tech stack for marquee
  techs: ['Go', 'Python', 'TypeScript', 'Rust', 'Docker', 'Linux', 'Nginx', 'WireGuard', 'PostgreSQL', 'Redis', 'Firebase', 'Bash', 'Nmap', 'Wireshark'] as const,
} as const;

// API endpoints derived from config
const SAFE_DISCORD_ID = /^\d{17,20}$/;
const SAFE_AVATAR_HASH = /^[a-f0-9]{32}$/i;

export const api = {
  lanyardWs: `wss://api.lanyard.rest/socket`,
  discordAvatar: (userId: string, avatarId: string) => {
    if (!SAFE_DISCORD_ID.test(userId) || !SAFE_AVATAR_HASH.test(avatarId)) return '';
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png?size=128`;
  },
  discordProfile: `https://dcdn.dstn.to/profile/${config.discord.id}`,
  githubUser: `https://api.github.com/users/${config.github.username}`,
  githubRepos: `https://api.github.com/users/${config.github.username}/repos?per_page=100&sort=updated`,
} as const;
