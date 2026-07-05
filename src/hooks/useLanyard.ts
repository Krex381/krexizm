import { useState, useEffect, useRef } from 'react';
import { config } from '@/config';

interface LanyardData {
  kv: Record<string, string>;
  discord_user: {
    id: string;
    username: string;
    global_name: string;
    avatar: string;
    avatar_decoration_data: any;
    bot: boolean;
    discriminator: string;
    public_flags: number;
  };
  activities: any[];
  discord_status: string;
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  listening_to_spotify: boolean;
  spotify: any;
}

export function useLanyard() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<number | undefined>(undefined);
  const reconnectRef = useRef<number | undefined>(undefined);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let heartbeatInterval = 30000;

    function connect() {
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
              // Hello: set heartbeat interval and send it, then subscribe
              heartbeatInterval = msg.d.heartbeat_interval || 30000;
              clearInterval(heartbeatRef.current);
              heartbeatRef.current = window.setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({ op: 3 }));
                }
              }, heartbeatInterval);

              // Subscribe with subscribe_to_id (singular) for single user
              ws.send(JSON.stringify({
                op: 2,
                d: { subscribe_to_id: config.discord.id },
              }));
            }

            if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
              // subscribe_to_id returns presence directly (not wrapped in userId map)
              setData(msg.d as LanyardData);
              setLoading(false);
            }
          } catch { /* ignore */ }
        };

        ws.onclose = () => {
          clearInterval(heartbeatRef.current);
          if (mountedRef.current) {
            reconnectRef.current = window.setTimeout(connect, 3000);
          }
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        if (mountedRef.current) {
          reconnectRef.current = window.setTimeout(connect, 3000);
        }
      }
    }

    connect();

    return () => {
      mountedRef.current = false;
      clearInterval(heartbeatRef.current);
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, []);

  return { data, loading };
}
