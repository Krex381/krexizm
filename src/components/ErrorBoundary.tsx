import { Component, type ReactNode, type ErrorInfo } from 'react';
import { httpCatUrl } from '@/lib/httpcat';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const code = this.extractCode(this.state.error);
      return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0a0a' }}>
          <div className="glass p-8 max-w-lg w-full text-center">
            <img
              src={httpCatUrl(code)}
              alt={`HTTP ${code} cat`}
              className="w-full max-w-xs mx-auto mb-6 rounded-xl"
              loading="lazy"
            />
            <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: "'Geist Mono', monospace" }}>
              {code}
            </h1>
            <p className="text-secondary text-lg mb-2">
              {this.getMessage(code)}
            </p>
            <p className="text-muted text-sm mb-6">
              {this.state.error?.message}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="glass glass-hover px-6 py-2.5 text-sm font-mono text-foreground"
              style={{ fontFamily: "'Geist Mono', monospace" }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }

  private extractCode(err: Error | null): number {
    if (!err) return 500;
    const match = err.message.match(/(\d{3})/);
    return match ? parseInt(match[1]) : 500;
  }

  private getMessage(code: number): string {
    const msgs: Record<number, string> = {
      404: 'This page wandered off and found a cat instead.',
      500: 'Something broke. The cat is judging you.',
      403: 'Access denied. The cat says no.',
      418: "I'm a teapot. The cat confirms it.",
      502: 'Bad gateway. The cat is confused.',
      503: 'Service unavailable. The cat is napping.',
    };
    return msgs[code] || 'Unexpected error. The cat is concerned.';
  }
}
