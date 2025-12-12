# OlamKulo

A full-stack application with NestJS backend and React frontend, both using TypeScript, with Supabase integration and OAuth authentication.

## Project Structure

```
OlamKulo/
├── backend/          # NestJS backend with TypeScript
├── frontend/         # React frontend with TypeScript
├── supabase/         # Supabase migrations
│   └── migrations/   # SQL migration files
└── README.md
```

## Backend Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Supabase credentials:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3000
FRONTEND_URL=http://localhost:5173
```

5. Run the development server:
```bash
npm run start:dev
```

The backend will be available at `http://localhost:3000`

## Frontend Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Features

### Backend (NestJS)
- ✅ TypeScript configuration
- ✅ Supabase database connection
- ✅ OAuth authentication (Google, GitHub, etc.)
- ✅ Supabase token-based authentication
- ✅ RESTful API endpoints
- ✅ Input validation with class-validator
- ✅ CORS enabled

### Frontend (React)
- ✅ TypeScript configuration
- ✅ React Router for navigation
- ✅ Supabase client integration
- ✅ Authentication context
- ✅ Protected routes
- ✅ OAuth login support
- ✅ Modern UI with Vite

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout
- `GET /auth/oauth?provider=google` - Get OAuth URL
- `GET /auth/callback?code=...` - Handle OAuth callback
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user (protected)

## Database Migrations

This project uses Supabase migrations to manage database schema changes. See `supabase/README.md` for detailed instructions.

### Quick Setup: Disable Email Confirmation

To disable email confirmation (users can sign in immediately after signup):

**Option 1: Via Supabase Dashboard (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Settings**
3. Under **Email Auth**, disable **"Enable email confirmations"**
4. Save changes

**Option 2: Via SQL Migration**
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run the migration: `supabase/migrations/20241210000000_disable_email_confirmation.sql`
4. This will auto-confirm users on signup

## OAuth Setup

To enable OAuth providers (Google, GitHub, etc.):

1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Enable the providers you want to use
4. Configure the OAuth credentials for each provider
5. Add the redirect URL: `http://localhost:5173/auth/callback`

## Development

### Backend Commands
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Frontend Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT

