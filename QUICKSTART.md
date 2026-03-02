# Quick Start Guide

This guide will get you up and running with LCONN in under 10 minutes.

## Prerequisites Check

Make sure you have:
- Node.js 18+ installed (`node --version`)
- Docker installed and running (`docker --version`)
- A GitHub account

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup GitHub OAuth (5 minutes)

1. Visit: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** `LCONN Local Dev`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3001/api/auth/github/callback`
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it

### 3. Configure Environment Variables

**Backend:**

```bash
cd packages/backend
cp .env.example .env
```

Edit `packages/backend/.env` and paste your GitHub credentials:
```env
GITHUB_CLIENT_ID=paste_your_client_id_here
GITHUB_CLIENT_SECRET=paste_your_client_secret_here
```

**Frontend:**

```bash
cd packages/frontend
cp .env.example .env
# No changes needed for local dev
```

### 4. Start Database

From the project root:

```bash
docker-compose up -d
```

Wait a few seconds for PostgreSQL to start.

### 5. Setup Database

```bash
cd packages/backend
npm run db:generate
npm run db:migrate
```

### 6. Build Shared Types

```bash
cd packages/shared
npm run build
```

### 7. Start the Application

From project root:

```bash
npm run dev
```

This starts both frontend (port 3000) and backend (port 3001).

### 8. Open the App

Open http://localhost:3000 in your browser!

## First Steps

1. Click **"Login with GitHub"** to authenticate
2. Click **"Create Part"** and add your first LEGO part (e.g., "2x4 Brick")
3. On the part detail page, click **"Add Connection Spec"**
4. Fill out the connection specification form
5. Vote on your own spec to test the voting system

## Troubleshooting

**Port already in use?**
- Backend: Change `PORT` in `packages/backend/.env`
- Frontend: Change `server.port` in `packages/frontend/vite.config.ts`

**Database won't start?**
```bash
docker-compose down
docker-compose up -d
docker-compose logs postgres
```

**TypeScript errors?**
```bash
cd packages/shared
npm run build
```

**OAuth errors?**
- Verify callback URL is exactly: `http://localhost:3001/api/auth/github/callback`
- Check that Client ID and Secret are correct in `.env`

## Next Steps

- Explore the codebase in `packages/shared/src/types/connections.ts`
- Try adding a new connection type
- Read the full README.md for detailed documentation
- Check out the API endpoints in the README

## Stop the Application

```bash
# Stop dev servers: Ctrl+C in the terminal

# Stop database:
docker-compose down
```

Enjoy building with LCONN!
