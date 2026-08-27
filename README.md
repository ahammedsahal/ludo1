# Ludo.io

A mobile-first real-time multiplayer Ludo MVP with a polished competitive `.io` interface.

## Current MVP

- Landing, create room, join room, and random matchmaking flows
- Responsive Ludo game board with player HUD, turn timer, dice interaction, and voice controls
- Server-authoritative room lifecycle, turns, and dice generation
- Socket.IO real-time state synchronization
- 30-second disconnect reservation and reconnect-ready player state
- WebRTC signaling event boundary for future peer voice connections

## Stack

- Client: React, TypeScript, Vite, Framer Motion
- Server: Node.js, Express, Socket.IO
- Voice: WebRTC signaling over Socket.IO
- Production-ready next steps: Redis, PostgreSQL, HTTPS/WSS, dedicated game state persistence

## Run locally

### Client

```bash
cd client
npm install
npm run dev
```

### Server

```bash
cd server
npm install
npm run dev
```

The server listens on port `3001` by default.
