import { LazyMotion, m, domAnimation } from 'framer-motion';
import { config } from '@/config';
import { ExternalLink, Send } from 'lucide-react';
import { GithubIcon, DiscordIcon, InstagramIcon } from '@/components/Footer';

const iconMap: Record<string, typeof GithubIcon> = {
  GitHub: GithubIcon,
  Discord: DiscordIcon,
  Instagram: InstagramIcon,
};

const links = config.socials.map(s => ({
  ...s,
  icon: iconMap[s.name],
}));

export default function ConnectPage() {
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
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Geist Mono', monospace" }}>Connect</h1>
            <p className="text-secondary">Find me across the internet</p>
          </m.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {links.map((link, i) => (
              <m.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass glass-hover p-6 flex items-center gap-4 no-underline group"
              >
              <div className="text-secondary group-hover:text-foreground transition-colors">
                {link.icon && <link.icon size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>
                    {link.name}
                  </h3>
                  <ExternalLink size={12} className="text-muted" />
                </div>
                <p className="text-sm text-secondary">{link.description}</p>
                <p className="text-xs text-muted mt-1 font-mono" style={{ fontFamily: "'Geist Mono', monospace" }}>
                  {link.handle}
                </p>
              </div>
              </m.a>
            ))}
          </div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#23a55a] animate-pulse" />
              <span className="text-sm text-secondary">Currently available for collaboration</span>
            </div>
            <p className="text-xs text-muted">
              Open to networking, open source contributions, and interesting projects.
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="glass p-8 text-center"
          >
          <Send size={24} className="text-secondary mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Geist Mono', monospace" }}>
            Let's Build Something
          </h2>
          <p className="text-sm text-secondary mb-4 max-w-md mx-auto">
            Whether it's a network architecture, a backend service, or an open source project — I'm always interested in new challenges.
          </p>
          <a
            href={config.socials[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover inline-flex items-center gap-2 px-6 py-2.5 text-sm font-mono text-foreground no-underline"
            style={{ fontFamily: "'Geist Mono', monospace" }}
          >
            <GithubIcon size={14} />
            View Projects
          </a>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
}
