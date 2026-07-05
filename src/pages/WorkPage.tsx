import { LazyMotion, m, domAnimation } from 'framer-motion';
import { config, api } from '@/config';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star, GitFork, Code2 } from 'lucide-react';
import { useFetch } from '@/lib/useFetch';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  created_at: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Go: '#00ADD8',
  Python: '#3572A5',
  Rust: '#dea584',
  HTML: '#e34c26',
  Shell: '#89e051',
  PHP: '#4F5D95',
  'C#': '#178600',
  Ruby: '#701516',
  Java: '#b07219',
  C: '#555555',
  Cpp: '#f34b7d',
};

function FeaturedRepos({ repos }: { repos: Repo[] }) {
  const featured = repos
    .filter(r => !r.fork && !config.excludeRepos.includes(r.name as any))
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3);

  return (
    <div className="space-y-3">
      {featured.map((repo, i) => (
        <m.a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="glass glass-hover block p-6 no-underline"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Code2 size={16} className="text-secondary shrink-0" />
                <h3 className="font-bold text-foreground truncate" style={{ fontFamily: "'Geist Mono', monospace" }}>
                  {repo.name}
                </h3>
                <ExternalLink size={12} className="text-muted shrink-0" />
              </div>
              <p className="text-sm text-secondary line-clamp-2 mb-3">
                {repo.description || 'No description provided.'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {repo.language && (
                  <Badge variant="secondary" className="text-xs bg-white/5 text-secondary border-white/5">
                    <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: LANG_COLORS[repo.language] || '#888' }} />
                    {repo.language}
                  </Badge>
                )}
                {repo.topics.slice(0, 3).map(t => (
                  <Badge key={t} variant="secondary" className="text-xs bg-white/5 text-secondary border-white/5">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-xs text-muted shrink-0">
              <span className="flex items-center gap-1"><Star size={12} /> {repo.stargazers_count}</span>
              <span className="flex items-center gap-1"><GitFork size={12} /> {repo.forks_count}</span>
            </div>
          </div>
        </m.a>
      ))}
    </div>
  );
}

function BentoGrid({ repos }: { repos: Repo[] }) {
  const others = repos
    .filter(r => !r.fork && !config.excludeRepos.includes(r.name as any))
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(3, 9);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {others.map((repo, i) => (
        <m.a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
          className="glass glass-hover p-4 no-underline"
        >
          <h4 className="font-semibold text-sm text-foreground mb-1 truncate" style={{ fontFamily: "'Geist Mono', monospace" }}>
            {repo.name}
          </h4>
          <p className="text-xs text-secondary line-clamp-2 mb-2">
            {repo.description || 'No description'}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: LANG_COLORS[repo.language] || '#888' }} />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1"><Star size={10} /> {repo.stargazers_count}</span>
          </div>
        </m.a>
      ))}
    </div>
  );
}

function ContributionGraph() {
  return (
    <div className="glass p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: "'Geist Mono', monospace" }}>
        Contributions
      </h3>
      <div className="overflow-x-auto">
        <img
          src={`https://gh-heat.anishroy.com/api/${config.github.username}/svg?darkMode=true&theme=green&bg=0a0a0a&transparent=true&showMonthLabels=true&showDayLabels=true&showLegend=false&cellSize=13&cellGap=3&padding=16`}
          alt={`${config.github.username} contribution chart`}
          className="w-full"
        />
      </div>
    </div>
  );
}

function LanguagesBar({ repos }: { repos: Repo[] }) {
  const langMap: Record<string, number> = {};
  for (const r of repos) {
    if (!r.fork && r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
  }
  const total = Object.values(langMap).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(langMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="glass p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: "'Geist Mono', monospace" }}>
        Languages
      </h3>
      <div className="flex rounded-full overflow-hidden h-3 mb-4 bg-white/5">
        {sorted.map(([lang, count]) => (
          <div
            key={lang}
            style={{
              width: `${(count / total) * 100}%`,
              background: LANG_COLORS[lang] || '#888',
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {sorted.map(([lang, count]) => (
          <div key={lang} className="flex items-center gap-1.5 text-xs text-secondary">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: LANG_COLORS[lang] || '#888' }} />
            {lang}
            <span className="text-muted">({count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkPage() {
  const { data: allRepos, loading, error } = useFetch<any[]>(api.githubRepos);
  const repos = Array.isArray(allRepos) ? allRepos : [];

  if (loading) {
    return (
      <div className="page-content">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <div className="skeleton h-8 w-48 mx-auto" />
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 w-full" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <LazyMotion features={domAnimation} strict>
        <div className="page-content">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Geist Mono', monospace" }}>Work</h1>
              <p className="text-secondary">Open source projects and experiments</p>
            </m.div>
            <div className="glass p-6 text-center">
              <p className="text-secondary">GitHub API rate limited. Try again in a minute.</p>
            </div>
          </div>
        </div>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="page-content">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Geist Mono', monospace" }}>Work</h1>
            <p className="text-secondary">Open source projects and experiments</p>
          </m.div>

          <FeaturedRepos repos={repos} />
          <BentoGrid repos={repos} />
          <ContributionGraph />
          <LanguagesBar repos={repos} />
        </div>
      </div>
    </LazyMotion>
  );
}
