import type { IconType } from 'react-icons';
import {
  SiGo, SiPython, SiTypescript, SiRust, SiDocker,
  SiNginx, SiWireguard, SiPostgresql, SiRedis, SiWireshark,
  SiGnubash, SiLua, SiLuau, SiC, SiCplusplus, SiSharp, SiPhp, SiRuby,
  SiSwift, SiKotlin, SiScala, SiPerl, SiHaskell, SiElixir, SiErlang,
  SiZig, SiR, SiCss, SiSass, SiTailwindcss,
  SiGraphql, SiReact, SiVuedotjs, SiAngular, SiSvelte, SiNextdotjs,
  SiVite, SiVitest, SiWebpack, SiEsbuild, SiPnpm, SiBun,
  SiDeno, SiNodedotjs, SiMysql, SiSqlite, SiMariadb, SiMongodb,
  SiKubernetes, SiTerraform, SiAnsible,
  SiVim, SiNeovim, SiArchlinux, SiUbuntu, SiDebian, SiCentos,
  SiRedhat, SiFedora, SiAlpinelinux, SiProxmox, SiVmware, SiVirtualbox,
  SiTensorflow, SiPytorch, SiPandas, SiNumpy, SiJupyter, SiNotion,
  SiDiscord, SiTelegram, SiSpotify, SiYoutubetv, SiTwitch, SiReddit,
  SiStackoverflow, SiMedium, SiInstagram, SiWordpress, SiShopify,
  SiStripe, SiPaypal, SiArduino, SiFigma, SiGrafana, SiPrometheus,
  SiElasticsearch, SiInfluxdb, SiApachekafka, SiRabbitmq, SiSelenium,
  SiCypress, SiJest, SiMocha, SiCloudflare, SiVercel, SiNetlify, SiFirebase,
} from 'react-icons/si';
import {
  FaJava, FaHtml5, FaJs, FaGitAlt,
  FaGithub, FaAws, FaLinux, FaNpm, FaYarn,
  FaDigitalOcean, FaLinode, FaJenkins,
} from 'react-icons/fa';

const iconMap: Record<string, IconType> = {
  // Languages
  go: SiGo,
  python: SiPython,
  typescript: SiTypescript,
  javascript: FaJs,
  rust: SiRust,
  lua: SiLua,
  luau: SiLuau,
  c: SiC,
  'c++': SiCplusplus,
  'c#': SiSharp,
  java: FaJava,
  php: SiPhp,
  ruby: SiRuby,
  swift: SiSwift,
  kotlin: SiKotlin,
  scala: SiScala,
  perl: SiPerl,
  haskell: SiHaskell,
  elixir: SiElixir,
  erlang: SiErlang,
  zig: SiZig,
  r: SiR,
  bash: SiGnubash,

  // Frontend
  react: SiReact,
  vue: SiVuedotjs,
  svelte: SiSvelte,
  angular: SiAngular,
  nextjs: SiNextdotjs,
  'next.js': SiNextdotjs,
  vite: SiVite,
  vitest: SiVitest,
  webpack: SiWebpack,
  esbuild: SiEsbuild,
  tailwindcss: SiTailwindcss,
  tailwind: SiTailwindcss,
  sass: SiSass,
  html: FaHtml5,
  css: SiCss,
  graphql: SiGraphql,

  // Backend / Runtime
  nodejs: SiNodedotjs,
  'node.js': SiNodedotjs,
  node: SiNodedotjs,
  fiber: SiGo,

  // Databases
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  redis: SiRedis,
  mysql: SiMysql,
  sqlite: SiSqlite,
  mongodb: SiMongodb,
  mariadb: SiMariadb,
  elasticsearch: SiElasticsearch,
  influxdb: SiInfluxdb,
  firebase: SiFirebase,

  // DevOps / Infra
  docker: SiDocker,
  kubernetes: SiKubernetes,
  k8s: SiKubernetes,
  terraform: SiTerraform,
  ansible: SiAnsible,
  jenkins: FaJenkins,
  git: FaGitAlt,
  github: FaGithub,

  // Cloud
  aws: FaAws,
  cloudflare: SiCloudflare,
  vercel: SiVercel,
  netlify: SiNetlify,
  digitalocean: FaDigitalOcean,
  linode: FaLinode,

  // Networking / Security
  nginx: SiNginx,
  wireguard: SiWireguard,
  wireshark: SiWireshark,
  linux: FaLinux,

  // Package managers
  npm: FaNpm,
  pnpm: SiPnpm,
  yarn: FaYarn,
  bun: SiBun,
  deno: SiDeno,

  // Messaging / Queues
  kafka: SiApachekafka,
  rabbitmq: SiRabbitmq,

  // Monitoring
  grafana: SiGrafana,
  prometheus: SiPrometheus,

  // Testing
  selenium: SiSelenium,
  cypress: SiCypress,
  jest: SiJest,
  mocha: SiMocha,

  // Editors
  vim: SiVim,
  neovim: SiNeovim,
  vscode: SiNeovim,

  // OS
  arch: SiArchlinux,
  'arch linux': SiArchlinux,
  ubuntu: SiUbuntu,
  debian: SiDebian,
  centos: SiCentos,
  redhat: SiRedhat,
  fedora: SiFedora,
  alpine: SiAlpinelinux,

  // Virtualization
  proxmox: SiProxmox,
  vmware: SiVmware,
  virtualbox: SiVirtualbox,

  // AI/ML
  tensorflow: SiTensorflow,
  pytorch: SiPytorch,
  pandas: SiPandas,
  numpy: SiNumpy,
  jupyter: SiJupyter,

  // Hardware
  arduino: SiArduino,
  raspberry_pi: SiArduino,

  // Productivity / Tools
  notion: SiNotion,
  discord: SiDiscord,
  telegram: SiTelegram,
  spotify: SiSpotify,
  youtube: SiYoutubetv,
  twitch: SiTwitch,
  reddit: SiReddit,
  stackoverflow: SiStackoverflow,
  medium: SiMedium,
  instagram: SiInstagram,
  wordpress: SiWordpress,
  shopify: SiShopify,
  stripe: SiStripe,
  paypal: SiPaypal,
  figma: SiFigma,
};

export function getTechIcon(name: string): IconType | null {
  const lower = name.toLowerCase().trim();
  return iconMap[lower] || null;
}
