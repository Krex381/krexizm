import { useState, useEffect, useRef, useMemo } from 'react';
import { LazyMotion, m, domAnimation } from 'framer-motion';
import { config, api } from '@/config';
import { useLanyard, type LanyardData } from '@/hooks/useLanyard';
import { useFetch } from '@/lib/useFetch';
import { getCountryCode } from '@/lib/flags';
import ReactCountryFlag from 'react-country-flag';
import { getTechIcon } from '@/lib/techIcons';
import { resolveActivityImage, formatTimestamp } from '@/lib/discord';
import SplitText from '@/components/SplitText';
import BlurText from '@/components/BlurText';
import CountUp from '@/components/CountUp';
import { Badge } from '@/components/ui/badge';
import { Globe, Clock, Calendar, Shield, Terminal, Server, Network, Database, Code2, Music, Monitor, Smartphone, Gamepad2, Heart } from 'lucide-react';

interface DiscordUser {
  id: string;
  username: string;
  global_name: string;
  avatar: string;
  bio?: string;
}

interface DiscordBadge {
  id: string;
  icon: string;
  description: string;
}

interface DiscordProfile {
  user: DiscordUser;
  badges: DiscordBadge[];
  widgets?: DiscordWidget[];
}

interface DiscordWidget {
  data?: {
    type: string;
    games?: WidgetGame[];
  };
}

interface WidgetGame {
  game_id: string;
}

interface GitHubUser {
  public_repos: number;
  followers: number;
}

interface GitHubRepo {
  stargazers_count: number;
}

const statusColors: Record<string, string> = {
  online: '#23a55a',
  idle: '#f0b232',
  dnd: '#f23f43',
  offline: '#80848e',
};

const VIENNA_FMT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Vienna',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

function LocalClock() {
  const formatTime = (d: Date) => `${VIENNA_FMT.format(d)}.${String(d.getMilliseconds()).padStart(3, '0')}`;

  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    let id: number;
    const update = () => {
      setTime(formatTime(new Date()));
      id = requestAnimationFrame(update);
    };
    id = requestAnimationFrame(update);
    return () => cancelAnimationFrame(id);
  }, []);

  return <>{time}</>;
}

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const DOB = new Date(config.dateOfBirth);

function LiveAge() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let lastFrame = -1;
    let id: number;
    const update = () => {
      const now = Date.now();
      const currentFrame = Math.floor(now / 200);
      if (currentFrame !== lastFrame && ref.current) {
        lastFrame = currentFrame;
        ref.current.textContent = ((now - DOB.getTime()) / MS_PER_YEAR).toFixed(8) + ' years';
      }
      id = requestAnimationFrame(update);
    };
    id = requestAnimationFrame(update);
    return () => cancelAnimationFrame(id);
  }, []);

  const initial = ((Date.now() - DOB.getTime()) / MS_PER_YEAR).toFixed(8);

  return <span ref={ref}>{initial} years</span>;
}

function IdentityBlock() {
  return (
    <div className="glass p-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
      <div className="flex items-center gap-3">
        <ReactCountryFlag
          countryCode={getCountryCode(config.country)}
          svg
          style={{ width: '2.5rem', height: '2.5rem' }}
          title={config.country}
        />
        <div>
          <p className="text-sm text-secondary">Location</p>
          <p className="font-mono text-sm" style={{ fontFamily: "'Geist Mono', monospace" }}>{config.location}</p>
        </div>
      </div>
      <div className="hidden sm:block w-px h-8 bg-white/10" />
      <div>
        <p className="text-sm text-secondary flex items-center gap-1.5 justify-center">
          <Clock size={12} /> Local Time
        </p>
        <p className="font-mono text-sm tabular-nums" style={{ fontFamily: "'Geist Mono', monospace" }}>
          <LocalClock />
        </p>
      </div>
      <div className="hidden sm:block w-px h-8 bg-white/10" />
      <div>
        <p className="text-sm text-secondary flex items-center gap-1.5 justify-center">
          <Calendar size={12} /> Age
        </p>
        <p className="font-mono text-sm tabular-nums" style={{ fontFamily: "'Geist Mono', monospace" }}>
          <LiveAge />
        </p>
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: LanyardData['activities'][number] }) {
  const [largeImage, setLargeImage] = useState<string | null>(null);
  const [smallImage, setSmallImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const large = await resolveActivityImage(
        activity.assets?.large_image,
        activity.application_id
      );
      const small = await resolveActivityImage(
        activity.assets?.small_image,
        activity.application_id
      );
      if (!cancelled) {
        setLargeImage(large);
        setSmallImage(small);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [activity]);

  const icon = activity.type === 0 ? '🎮' : activity.type === 1 ? '📡' : activity.type === 2 ? '🎵' : activity.type === 3 ? '👁️' : '';
  const isSpotify = activity.type === 2;

  return (
    <div className="flex items-start gap-3 p-2 rounded-lg bg-white/[0.02]">
      {largeImage ? (
        <div className="relative shrink-0">
          <img
            src={largeImage}
            alt={activity.name || 'Activity'}
            width={48}
            height={48}
            loading="lazy"
            className="w-12 h-12 rounded-lg object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {smallImage && (
            <img
              src={smallImage}
              alt=""
              width={20}
              height={20}
              loading="lazy"
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0a0a0a]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>
      ) : (
        <span className="text-lg shrink-0 mt-1">{icon}</span>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-medium text-sm truncate">{activity.name}</span>
          {isSpotify && <Music size={12} className="text-[#1db954] shrink-0" />}
        </div>
        {activity.details && (
          <p className="text-xs text-secondary truncate">{activity.details}</p>
        )}
        {activity.state && (
          <p className="text-xs text-muted truncate">{activity.state}</p>
        )}
        {activity.timestamps?.start && (
          <p className="text-[10px] text-muted mt-0.5">
            {formatTimestamp(activity.timestamps.start, activity.timestamps.end || undefined)} elapsed
          </p>
        )}
      </div>
    </div>
  );
}

function DiscordBlock({ profile }: { profile: DiscordProfile | null }) {
  const { data: status, loading: statusLoading } = useLanyard();

  if (statusLoading) {
    return <div className="glass p-6"><div className="skeleton h-40 w-full" /></div>;
  }

  const user = profile?.user;
  const allActivities = status?.activities || [];
  const activities = allActivities.filter((a) => a.type !== 4);
  const discordStatus = status?.discord_status || 'offline';
  const badges = profile?.badges || [];
  const bio = user?.bio || '';

  return (
    <div className="glass p-6">
      <div className="flex items-end gap-4 mb-4">
        <div className="relative shrink-0">
          {user?.avatar ? (
            <img
              src={api.discordAvatar(user.id, user.avatar)}
              alt="Discord avatar"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full border-4 border-[#0a0a0a]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full border-4 border-[#0a0a0a] bg-surface-elevated flex items-center justify-center text-2xl font-bold text-secondary">
              {user?.username?.[0] || '?'}
            </div>
          )}
          <span className="group/status absolute -bottom-0.5 -right-0.5">
            <div
              className="w-4 h-4 rounded-full border-[3px] border-[#0a0a0a]"
              style={{ background: statusColors[discordStatus] || statusColors.offline }}
            />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1a1a1a] text-[10px] text-foreground rounded whitespace-nowrap opacity-0 group-hover/status:opacity-100 transition-opacity pointer-events-none border border-white/10 z-10">
              {discordStatus === 'dnd' ? 'Do Not Disturb' : discordStatus === 'online' ? 'Online' : discordStatus === 'idle' ? 'Idle' : 'Offline'}
            </span>
          </span>
        </div>

        <div className="pb-1">
          <p className="text-lg font-bold text-foreground">{user?.global_name || user?.username}</p>
          <p className="text-sm text-secondary font-mono" style={{ fontFamily: "'Geist Mono', monospace" }}>
            {user?.username}
          </p>
          <div className="flex gap-1.5 mt-1.5">
            {badges.map((b) => (
              <span key={b.id} className="group relative">
                <img
                  src={`https://cdn.discordapp.com/badge-icons/${b.icon}.png?size=32`}
                  alt={b.description}
                  width={20}
                  height={20}
                  loading="lazy"
                  className="w-5 h-5"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1a1a1a] text-[10px] text-foreground rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
                  {b.description}
                </span>
              </span>
            ))}
            {status?.active_on_discord_desktop && (
              <span className="group relative">
                <Monitor size={20} className="text-secondary" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1a1a1a] text-[10px] text-foreground rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
                  Desktop
                </span>
              </span>
            )}
            {status?.active_on_discord_mobile && (
              <span className="group relative">
                <Smartphone size={20} className="text-secondary" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1a1a1a] text-[10px] text-foreground rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
                  Mobile
                </span>
              </span>
            )}
            {status?.active_on_discord_web && (
              <span className="group relative">
                <Globe size={20} className="text-secondary" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1a1a1a] text-[10px] text-foreground rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
                  Web
                </span>
              </span>
            )}
            <span className="group relative love-text">
              <Heart size={20} className="text-red-500 fill-red-500/30 hover:fill-red-500 transition-colors cursor-default relative z-10" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[#1a1a1a] text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-red-500/20 z-20">
                <span className="text-foreground">❤️ my GF</span>
              </span>
            </span>
          </div>
        </div>
      </div>

      {bio && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">About me</p>
          <p className="text-sm text-secondary mb-4 whitespace-pre-line">{bio}</p>
        </>
      )}

      <div className="mb-3">
        {activities.length > 0 ? (
          <div className="space-y-1">
            {activities.slice(0, 3).map((a) => (
              <ActivityItem key={a.id || a.name} activity={a} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted italic">No activities right now</p>
        )}
      </div>
    </div>
  );
}

interface GameInfo {
  id: string;
  name: string;
  icon: string | null;
  cover: string | null;
}

function useGameInfo(gameId: string): { game: GameInfo | null; loading: boolean } {
  const [game, setGame] = useState<GameInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadGame() {
      try {
        const res = await fetch(`https://discord.com/api/v10/applications/${gameId}/rpc`);
        if (!res.ok) throw new Error('not found');
        const data = await res.json();
        if (!cancelled) {
          setGame({
            id: gameId,
            name: data.name || gameId,
            icon: data.icon ? `https://cdn.discordapp.com/app-icons/${gameId}/${data.icon}.png?size=128` : null,
            cover: data.cover_image ? `https://cdn.discordapp.com/app-assets/${gameId}/${data.cover_image}.png?size=512` : null,
          });
        }
      } catch {
        if (!cancelled) setGame({ id: gameId, name: gameId, icon: null, cover: null });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadGame();
    return () => { cancelled = true; };
  }, [gameId]);

  return { game, loading };
}

function GameTile({ gameId }: { gameId: string }) {
  const { game, loading } = useGameInfo(gameId);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] animate-pulse">
        <div className="w-10 h-10 rounded-lg bg-white/5" />
        <div className="h-3 w-20 rounded bg-white/5" />
      </div>
    );
  }

  return (
    <div className="group relative flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      {game?.icon ? (
        <img
          src={game.icon}
          alt={game.name}
          width={40}
          height={40}
          loading="lazy"
          className="w-10 h-10 rounded-lg object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
          <Gamepad2 size={16} className="text-muted" />
        </div>
      )}
      <span className="text-xs text-secondary truncate">{game?.name}</span>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1a1a1a] text-[10px] text-foreground rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 z-10">
        {game?.name}
      </span>
    </div>
  );
}

function GamesWidget({ widgets }: { widgets: DiscordWidget[] }) {
  const currentWidget = widgets.find((w) => w.data?.type === 'current_games');
  const playedWidget = widgets.find((w) => w.data?.type === 'played_games');

  const currentGames = currentWidget?.data?.games || [];
  const playedGames = playedWidget?.data?.games || [];

  if (currentGames.length === 0 && playedGames.length === 0) return null;

  return (
    <div className="glass p-4">
      <div className="flex items-center gap-2 mb-3">
        <Gamepad2 size={14} className="text-secondary" />
        <span className="text-xs font-semibold text-secondary uppercase tracking-wider" style={{ fontFamily: "'Geist Mono', monospace" }}>
          Games
        </span>
      </div>

      {currentGames.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Currently Playing</p>
          <div className="flex flex-wrap gap-2">
            {currentGames.map((g) => (
              <GameTile key={g.game_id} gameId={g.game_id} />
            ))}
          </div>
        </div>
      )}

      {playedGames.length > 0 && (
        <div>
          <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Played</p>
          <div className="flex flex-wrap gap-2">
            {playedGames.map((g) => (
              <GameTile key={g.game_id} gameId={g.game_id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatsBlock() {
  const { data: user, loading: userLoading } = useFetch<GitHubUser>(api.githubUser);
  const { data: repos, loading: reposLoading } = useFetch<GitHubRepo[]>(api.githubRepos);
  const loading = userLoading || reposLoading;

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => <div key={i} className="glass p-4"><div className="skeleton h-12 w-full" /></div>)}
      </div>
    );
  }

  const totalStars = Array.isArray(repos) ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0) : 0;
  const stats = { repos: user?.public_repos || 0, followers: user?.followers || 0, stars: totalStars };

  const items = [
    { label: 'Repos', value: stats.repos, icon: <Code2 size={16} className="text-secondary" /> },
    { label: 'Followers', value: stats.followers, icon: <Globe size={16} className="text-secondary" /> },
    { label: 'Stars', value: stats.stars, icon: <Shield size={16} className="text-secondary" /> },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.label} className="glass p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1 text-secondary">
            {item.icon}
            <span className="text-xs uppercase tracking-wider">{item.label}</span>
          </div>
          <p className="text-3xl font-bold font-mono" style={{ fontFamily: "'Geist Mono', monospace" }}>
            <CountUp to={item.value} duration={2} />
          </p>
        </div>
      ))}
    </div>
  );
}

const skills = [
  { name: 'Network Engineering', icon: <Network size={18} />, tags: config.skills[0].tags },
  { name: 'Backend Development', icon: <Server size={18} />, tags: config.skills[1].tags },
  { name: 'Security', icon: <Shield size={18} />, tags: config.skills[2].tags },
  { name: 'Databases', icon: <Database size={18} />, tags: config.skills[3].tags },
  { name: 'Scripting', icon: <Terminal size={18} />, tags: config.skills[4].tags },
  { name: 'DevOps', icon: <Globe size={18} />, tags: config.skills[5].tags },
];

function SkillsBlock() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {skills.map((skill) => (
        <div key={skill.name} className="glass glass-hover p-5">
          <div className="flex items-center gap-2 mb-3 text-foreground">
            <span className="text-secondary">{skill.icon}</span>
            <span className="font-semibold text-sm" style={{ fontFamily: "'Geist Mono', monospace" }}>{skill.name}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skill.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-white/5 text-secondary border-white/5 hover:bg-white/10 transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const allTechs = [...config.techs, ...config.techs];

function TechMarquee() {
  return (
    <div className="overflow-hidden py-4">
      <div className="marquee-track">
        {allTechs.map((t, i) => {
          const Icon = getTechIcon(t);
          return (
            <span key={`tech-${t}-${i}`} className="px-4 py-2 glass text-sm text-secondary font-mono whitespace-nowrap inline-flex items-center gap-2" style={{ fontFamily: "'Geist Mono', monospace" }}>
              {Icon && <Icon size={16} />}
              {t}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: profile } = useFetch<DiscordProfile>(api.discordProfile);
  const widgets = profile?.widgets || [];

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="page-content">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-center py-8"
          >
            <SplitText
              text={config.displayName}
              className="text-6xl sm:text-7xl font-black tracking-tight"
            />
            <BlurText
              text={config.subtitle}
              className="text-lg text-secondary mt-4"
              delay={0.3}
            />
          </m.div>

          <IdentityBlock />
          <DiscordBlock profile={profile} />
          {widgets.length > 0 && <GamesWidget widgets={widgets} />}
          <StatsBlock />
          <SkillsBlock />
          <TechMarquee />
        </div>
      </div>
    </LazyMotion>
  );
}
