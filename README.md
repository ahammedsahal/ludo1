# Ludo.io

A mobile-first, server-authoritative real-time multiplayer Ludo game.

## Included

- 2–4 player private rooms with generated `LUDO-XXXX` codes
- Optional room passwords, locking, host kick and ready/start flow
- Random matchmaking queue
- Server-side dice, turns, legal move validation, captures, safe cells and win detection
- Six/capture bonus turns and 20-second turn timer
- Animated responsive board and legal-move highlighting
- Disconnect reservation and reconnecting status
- WebRTC peer voice signaling with microphone permission and mute state
- Rematch flow

## Development

### Server

```bash
cd server
npm install
npm run dev
```
Runs on `http://localhost:3001`.

### Client

```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`.

Set `VITE_SERVER_URL` if the game server is hosted elsewhere.

## Production

Use HTTPS/WSS for microphone access, run the server behind a reverse proxy, and replace the in-memory room/matchmaking maps with Redis for horizontal scaling. PostgreSQL can be added for accounts and persistent profiles without changing the game protocol.
