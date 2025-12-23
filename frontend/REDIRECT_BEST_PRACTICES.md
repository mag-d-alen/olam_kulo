# Redirect Best Practices

## Overview

This document outlines the redirect architecture and best practices for handling navigation in the authentication flow.

## Core Principle

**Route guards (`beforeLoad`) should handle ALL navigation logic. Hooks should only update state.**

## Redirect Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Route Guards (beforeLoad)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Public Routes: Redirect authenticated users away     │  │
│  │  Auth Layout: Ensure user is authenticated            │  │
│  │  Specific Routes: Handle route-specific conditions    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Hooks (useSignIn, useSignUp)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Update React Query cache                            │  │
│  │  Update sessionStorage                                │  │
│  │  DO NOT navigate - let route guards handle it         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Redirect Locations

### ✅ **Route Guards (beforeLoad)** - PRIMARY LOCATION

Route guards are the **single source of truth** for navigation logic.

#### 1. **Auth Layout Guard** (`routes/_auth/__layout.tsx`)
- **Purpose**: Ensure user is authenticated for all protected routes
- **Logic**: 
  - If no user → redirect to `/login`
- **Why here**: Applies to ALL routes under `/_auth/*`

```tsx
beforeLoad: ({ context }) => {
  if (!context.user) {
    throw redirect({ to: '/login' });
  }
}
```

#### 2. **Dashboard Route Guard** (`routes/_auth/dashboard.tsx`)
- **Purpose**: Ensure onboarding is complete
- **Logic**:
  - If user has no `homeCity` → redirect to `/onboarding`
- **Why here**: Specific requirement for dashboard access

```tsx
beforeLoad: ({ context }) => {
  const user = context.user;
  if (!user?.homeCity) {
    throw redirect({ to: '/onboarding' });
  }
}
```

#### 3. **Onboarding Route Guard** (`routes/_auth/onboarding.tsx`)
- **Purpose**: Prevent accessing onboarding if already complete
- **Logic**:
  - If user has `homeCity` → redirect to `/dashboard`
- **Why here**: Prevent unnecessary onboarding flow

```tsx
beforeLoad: ({ context }) => {
  const user = context.user;
  if (user?.homeCity) {
    throw redirect({ to: '/dashboard' });
  }
}
```

#### 4. **Public Route Guards** (`routes/_public/login.tsx`, `routes/_public/signup.tsx`)
- **Purpose**: Redirect authenticated users away from auth pages
- **Logic**:
  - If user has `homeCity` → redirect to `/dashboard`
  - If user authenticated but no `homeCity` → redirect to `/onboarding`
- **Why here**: Better UX - don't show login/signup to authenticated users

```tsx
beforeLoad: ({ context }) => {
  const user = context.user;
  if (user) {
    if (user.homeCity) {
      throw redirect({ to: '/dashboard' });
    } else {
      throw redirect({ to: '/onboarding' });
    }
  }
}
```

### ⚠️ **Hooks (useSignIn, useSignUp)** - MINIMAL NAVIGATION

**Hooks should trigger route guards, not decide where to go.**

Route guards only run when navigating to a route. After updating auth state, we need to trigger navigation so the guard can evaluate and redirect.

**Pattern: Navigate to current route to trigger guard**

```tsx
onSuccess: () => {
  // Update cache first
  queryClient.setQueryData(authKeys.user(), userData);
  queryClient.setQueryData(authKeys.session(), response.session);
  
  // Navigate to current route to trigger route guard
  // Guard will redirect based on user state (onboarding status)
  navigate({ to: '/login', replace: true });
}
```

**Why this works:**
1. Hook updates auth state (React Query cache)
2. Hook navigates to current route (login/signup)
3. Route guard evaluates: "Is user authenticated?"
4. Guard redirects to appropriate destination (dashboard/onboarding)

**Don't navigate directly to destination:**
```tsx
// ❌ Don't do this - bypasses guard logic
navigate({ to: '/dashboard' });
```

### ⚠️ **Exception: useSignOut**

`useSignOut` is the **only exception** where navigation in a hook is acceptable:

```tsx
onSuccess: () => {
  queryClient.setQueryData(authKeys.session(), null);
  queryClient.setQueryData(authKeys.user(), null);
  navigate({ to: '/login' }); // ✅ OK for explicit logout
}
```

**Why exception?**
- Sign out is an explicit user action
- We want immediate navigation feedback
- Session is cleared, so guards would redirect anyway

## Flow Examples

### Example 1: User Signs In

1. User submits login form → `signIn()` called
2. Hook updates React Query cache with user/session
3. Router context syncs from AuthContext
4. User is currently on `/login` (public route)
5. **Route guard** (`/login`) detects authenticated user → redirects to `/onboarding` or `/dashboard`
6. User lands on appropriate page

### Example 2: User Accesses Protected Route

1. User navigates to `/dashboard`
2. **Auth layout guard** checks: Is user authenticated? ✅
3. **Dashboard route guard** checks: Does user have `homeCity`?
   - ✅ Yes → Allow access
   - ❌ No → Redirect to `/onboarding`

### Example 3: Authenticated User Tries to Access Login

1. User navigates to `/login` while authenticated
2. **Login route guard** detects authenticated user
3. Redirects to `/dashboard` (if onboarding complete) or `/onboarding` (if not)

## Best Practices Summary

### ✅ DO

1. **Put redirect logic in `beforeLoad` guards**
2. **Use layout guards for general protection** (auth required)
3. **Use route-specific guards for specific conditions** (onboarding required)
4. **Let route guards handle navigation after mutations**
5. **Update React Query cache in hooks, not navigation**

### ❌ DON'T

1. **Don't navigate from `useSignIn` or `useSignUp`**
2. **Don't duplicate guard logic** (layout already checks auth)
3. **Don't use `loader` for redirects** (use `beforeLoad`)
4. **Don't check session in route guards** (use `context.user` from router context)

## Route Guard Execution Order

When navigating to a route, guards execute in this order:

1. **Root route** (`__root.tsx`) - No guards currently
2. **Layout route** (`_auth/__layout.tsx`) - Checks authentication
3. **Specific route** (`_auth/dashboard.tsx`) - Checks onboarding

If any guard throws a redirect, navigation stops and redirects immediately.

## Testing Redirects

When testing:
- Mock router context with user state
- Test guards independently
- Verify hooks don't navigate (except `useSignOut`)
- Test all redirect scenarios

## Migration Notes

If you need to add new redirects:

1. **Identify the condition**: What triggers the redirect?
2. **Choose the right guard**: Layout (general) or route (specific)?
3. **Use `beforeLoad`**: Not `loader`, not component logic
4. **Check context**: Use `context.user` from router context
5. **Don't navigate from hooks**: Let guards handle it

