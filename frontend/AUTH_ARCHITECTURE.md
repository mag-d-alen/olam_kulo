# Frontend Authentication & Authorization Architecture

## Overview

The authentication system uses a layered architecture with React Context, React Query, and TanStack Router working together.

## Architecture Flow

```
Login/SignUp
    ↓
Sets session in sessionStorage (via sessionManager)
    ↓
React Query hooks (useSession, useUser) fetch data
    ↓
AuthContext provides user & session via React Context
    ↓
Router Context syncs from AuthContext (for route guards)
    ↓
Components access via useAuthContext() hook
```

## Key Components

### 1. **Session Storage Layer** (`services/session.ts`)

- Manages session persistence in `sessionStorage`
- Provides `sessionManager` with methods: `setSession()`, `getSession()`, `clearSession()`
- Stores: `access_token`, `expires_at`, `user_id`

### 2. **React Query Hooks** (`authentication/hooks/useAuth.ts`)

- `useSession()`: Reads session from sessionStorage via React Query
- `useUser()`: Fetches user data from API when session exists
- `useSignIn()`, `useSignUp()`, `useSignOut()`: Mutation hooks for auth actions
- These hooks manage React Query cache and automatically sync with sessionStorage

### 3. **AuthContext** (`authentication/contexts/AuthContext.tsx`)

- React Context provider that wraps the app
- Consumes `useSession()` and `useUser()` hooks
- Provides `{ user, session, isLoading }` to all components
- **This is the primary way components access auth data**

### 4. **Router Context** (`App.tsx`)

- TanStack Router context for route guards
- Populated from `AuthContext` in `RouterWithAuth` component
- Used in `beforeLoad` hooks for route protection
- **Not meant for component consumption**

### 5. **Route Guards** (`routes/_auth/__layout.tsx`)

- Checks `context.user` from router context
- Redirects to `/login` if user is not authenticated
- Protects all routes under `/_auth/*`

## How Components Access User/Session

### ✅ **Correct Pattern** (Use `useAuthContext()`)

```tsx
import { useAuthContext } from '../authentication/contexts/AuthContext';

export const MyComponent = () => {
  const { user, session, isLoading } = useAuthContext();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return <div>Hello {user.email}</div>;
};
```

### ❌ **Incorrect Pattern** (Don't access router context directly)

```tsx
// DON'T DO THIS
import { useContext } from 'react';
import { AppRouterContext } from '../router.types';

const { user } = useContext(AppRouterContext); // ❌ Wrong!
```

## Data Flow Example: Login

1. **User submits login form** → calls `signIn()` from `useSignIn()` hook
2. **API call** → `authApi.signIn()` returns user and session
3. **React Query cache updated** → `queryClient.setQueryData()` sets user and session
4. **Session stored** → Session saved to sessionStorage (handled by authApi)
5. **AuthContext updates** → React Query triggers re-fetch, AuthContext re-renders
6. **Router context syncs** → `RouterWithAuth` reads from AuthContext and updates router
7. **Components re-render** → All components using `useAuthContext()` get new data
8. **Navigation** → User redirected to `/dashboard`

## Route Protection

### Protected Routes (`/_auth/*`)

- All routes under `/_auth/` are protected by `__layout.tsx`
- Checks `context.user` in `beforeLoad`
- Redirects to `/login` if not authenticated

### Public Routes (`/_public/*`)

- No authentication required
- Can still access `useAuthContext()` if needed

## Best Practices

1. **Always use `useAuthContext()` in components** - Don't access router context directly
2. **Handle loading states** - Check `isLoading` before using user/session
3. **Handle null states** - User/session can be `null` when not authenticated
4. **Use route guards for navigation** - Let `beforeLoad` handle redirects, not components
5. **Keep auth logic in hooks** - Use `useSignIn()`, `useSignOut()`, etc. for mutations

## File Structure

```
frontend/src/
├── authentication/
│   ├── contexts/
│   │   └── AuthContext.tsx      # React Context provider
│   ├── hooks/
│   │   └── useAuth.ts           # React Query hooks
│   ├── api/
│   │   └── authApi.ts           # API calls
│   └── types.ts                 # User type
├── services/
│   └── session.ts               # Session storage manager
├── routes/
│   └── _auth/
│       └── __layout.tsx         # Route guard
└── pages/
    └── DashboardPage.tsx        # Example component using useAuthContext()
```
