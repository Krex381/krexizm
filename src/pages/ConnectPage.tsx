import { useState, type FormEvent } from 'react';
import { LazyMotion, m, domAnimation } from 'framer-motion';
import { config } from '@/config';
import { ExternalLink, Send, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { GithubIcon, DiscordIcon, InstagramIcon, TelegramIcon } from '@/components/Footer';

const iconMap: Record<string, typeof GithubIcon> = {
  GitHub: GithubIcon,
  Discord: DiscordIcon,
  Telegram: TelegramIcon,
  Instagram: InstagramIcon,
};

const links = config.socials.map(s => ({
  ...s,
  icon: iconMap[s.name],
}));

export default function ConnectPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: config.web3formsAccessKey,
          subject: `Portfolio contact from ${name}`,
          from_name: name,
          email,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('sent');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="page-content">
        <div className="max-w-3xl mx-auto px-5 sm:px-4 space-y-5 sm:space-y-6">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: "'Geist Mono', monospace" }}>Connect</h1>
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
                className="glass glass-hover p-4 sm:p-6 flex items-center gap-3 sm:gap-4 no-underline group"
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
            className="glass p-6 sm:p-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail size={20} className="text-secondary" />
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Geist Mono', monospace" }}>
                Send a Message
              </h2>
            </div>
            <p className="text-sm text-secondary text-center mb-6">
              Drop me a message and I'll get back to you.
            </p>

            {status === 'sent' ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle size={40} className="text-[#23a55a]" />
                <p className="text-foreground font-semibold">Message sent!</p>
                <p className="text-sm text-secondary">Thanks for reaching out. I'll get back to you soon.</p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="text-xs text-muted hover:text-foreground transition-colors mt-2 cursor-pointer"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs text-muted mb-1.5 uppercase tracking-wider">Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-white/20 transition-colors"
                      style={{ fontFamily: "'Geist Mono', monospace" }}
                      placeholder="Your name"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs text-muted mb-1.5 uppercase tracking-wider">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-white/20 transition-colors"
                      style={{ fontFamily: "'Geist Mono', monospace" }}
                      placeholder="you@example.com"
                      maxLength={254}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs text-muted mb-1.5 uppercase tracking-wider">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-white/20 transition-colors resize-none"
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                    placeholder="What's on your mind?"
                    maxLength={2000}
                  />
                </div>
                {status === 'error' && (
                  <p className="text-xs text-red-400">Something went wrong. Try again or contact me directly.</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="glass glass-hover w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-mono text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
}
