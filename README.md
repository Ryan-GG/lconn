# LCONN - LEGO Connection Specifications Platform

A crowdsourced web application where users can submit, vote on, and collaboratively define LEGO connection specifications. TypeScript type definitions evolve through community PRs while connection data is stored in a PostgreSQL database.

## Features

- **Community-Driven**: Submit and vote on LEGO part connection specifications
- **Collaborative**: GitHub OAuth authentication for community contributions
- **Crowdsourced Validation**: Upvote/downvote system to surface the best specifications

## Architecture

### Tech Stack

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local database)
- GitHub OAuth App credentials (see setup below)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install all dependencies
npm install
```

### 2. Set Up GitHub OAuth

1. Go to https://github.com/settings/developers
2. Create a new OAuth App:
   - Application name: `LCONN Local Development`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3001/api/auth/github/callback`
3. Copy the Client ID and generate a Client Secret

### 3. Configure Environment Variables

**Backend (.env):**

```bash
cd packages/backend
cp .env.example .env
```

Edit `packages/backend/.env` and add your GitHub OAuth credentials:

```env
DATABASE_URL=postgresql://lconn:lconn_dev@localhost:5432/lconn
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:3001/api/auth/github/callback
SESSION_SECRET=your_random_session_secret_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**

```bash
cd packages/frontend
cp .env.example .env
```

The default values should work for local development:

```env
VITE_API_URL=http://localhost:3001
```

### 4. Start PostgreSQL Database

```bash
# From project root
docker compose up -d
```

Verify the database is running:

```bash
docker compose ps
```

### 5. Run Database Migrations

```bash
cd packages/backend
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
```

### 6. Build Shared Types

```bash
cd packages/shared
npm run build
```

### 7. Start Development Servers

From the project root, start both frontend and backend:

```bash
npm run dev
```

Or start them individually:

```bash
# Backend (from packages/backend)
npm run dev

# Frontend (from packages/frontend)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Development Workflow

### Testing the Application

1. **Authentication**: Click "Login with GitHub" to authenticate
2. **Create a Part**: Navigate to "Create Part" and add a LEGO part (e.g., "2x4 Brick")
3. **Add Connection Spec**: On the part detail page, click "Add Connection Spec"
4. **Vote**: Upvote or downvote connection specifications

### Database Management

View database in Drizzle Studio:

```bash
cd packages/backend
npm run db:studio
```

## Project Scripts

**Root:**
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build all packages
- `npm run typecheck` - Type check all packages

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio

**Frontend:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Shared:**
- `npm run build` - Compile TypeScript types
- `npm run dev` - Watch mode for type compilation

## License

MIT
