import { useState, useEffect, useRef, useCallback } from 'react';
import { config } from '@/config';

interface LanyardActivityAssets {
  large_image?: string;
  large_text?: string;
  small_image?: string;
  small_text?: string;
}

interface LanyardActivity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: { start?: number; end?: number };
  assets?: LanyardActivityAssets;
  application_id?: string;
}

interface LanyardSpotify {
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
  timestamps: { start: number; end: number };
}

export interface LanyardData {
  kv: Record<string, string>;
  discord_user: {
    id: string;
    username: string;
    global_name: string;
    avatar: string;
    avatar_decoration_data: Record<string, unknown> | null;
    bot: boolean;
    discriminator: string;
    public_flags: number;
  };
  activities: LanyardActivity[];
  discord_status: string;
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  listening_to_spotify: boolean;
  spotify: LanyardSpotify | null;
}

export function useLanyard() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  let heartbeatInterval = 30000;

  const clearHeartbeat = useCallback(() => {
    if (heartbeatRef.current !== null) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  const clearReconnect = useCallback(() => {
    if (reconnectRef.current !== null) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
  }, []);

  const closeWebSocket = useCallback(() => {
    const ws = wsRef.current;
    if (ws) {
      wsRef.current = null;
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.onopen = () => ws.close();
      } else if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    }
  }, []);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    try {
      const ws = new WebSocket('wss://api.lanyard.rest/socket');
      wsRef.current = ws;

      ws.onopen = () => {};

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const msg = JSON.parse(event.data);

          if (msg.op === 1) {
            heartbeatInterval = msg.d.heartbeat_interval || 30000;
            clearHeartbeat();
            heartbeatRef.current = window.setInterval(() => {
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ op: 3 }));
              }
            }, heartbeatInterval);

            ws.send(JSON.stringify({
              op: 2,
              d: { subscribe_to_id: config.discord.id },
            }));
          }

          if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
            setData(msg.d as LanyardData);
            setLoading(false);
          }
        } catch { /* ignore */ }
      };

      ws.onclose = () => {
        clearHeartbeat();
        if (mountedRef.current) {
          clearReconnect();
          reconnectRef.current = window.setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => {
        // Don't call close here - let onclose handle cleanup
      };
    } catch {
      if (mountedRef.current) {
        clearReconnect();
        reconnectRef.current = window.setTimeout(connect, 3000);
      }
    }
  }, [clearHeartbeat, clearReconnect]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      clearHeartbeat();
      clearReconnect();
      closeWebSocket();
    };
  }, [connect, clearHeartbeat, clearReconnect, closeWebSocket]);

  return { data, loading };
}
