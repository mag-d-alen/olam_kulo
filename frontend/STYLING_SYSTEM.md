# Styling System Documentation

## Overview

This project uses **Tailwind CSS** with a custom design system built on top of it. The styling system provides:

- Consistent design tokens (colors, typography, spacing)
- Reusable UI components
- Utility classes for common patterns
- Dark mode support (ready to implement)

## Design Tokens

### Colors

#### Primary (Blue)
- Used for primary actions, links, and important elements
- Available shades: `primary-50` through `primary-900`
- Default primary: `primary-600` (#2563eb)

#### Secondary (Violet)
- Used for secondary actions and accents
- Available shades: `secondary-50` through `secondary-900`
- Default secondary: `secondary-600` (#7c3aed)

#### Semantic Colors
- `background` - Main background color
- `surface` - Card/container backgrounds
- `text-primary` - Main text color
- `text-secondary` - Secondary text color
- `border` - Border colors
- `error`, `success`, `warning` - Status colors

### Usage

```tsx
// Using Tailwind classes
<div className="bg-primary-600 text-white">
  Primary background
</div>

// Using semantic colors
<div className="bg-surface text-text-primary border border-border">
  Card content
</div>
```

## UI Components

### Button

Located in `src/components/ui/Button.tsx`

```tsx
import { Button } from '@/components/ui';

// Primary button (default)
<Button onClick={handleClick}>Click me</Button>

// Secondary button
<Button variant="secondary">Secondary</Button>

// Outline button
<Button variant="outline">Outline</Button>

// Ghost button
<Button variant="ghost">Ghost</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// With loading state
<Button isLoading={isSubmitting}>Submit</Button>

// Disabled
<Button disabled>Disabled</Button>
```

### Input

Located in `src/components/ui/Input.tsx`

```tsx
import { Input } from '@/components/ui';

// Basic input
<Input 
  type="email" 
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With label
<Input 
  label="Email Address"
  type="email"
  placeholder="you@example.com"
/>

// With error
<Input 
  label="Email"
  type="email"
  error="Email is required"
/>

// With helper text
<Input 
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
/>
```

### Card

Located in `src/components/ui/Card.tsx`

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

// Basic card
<Card>
  <p>Card content</p>
</Card>

// Card with header
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>

// Different variants
<Card variant="elevated">Elevated card</Card>
<Card variant="outlined">Outlined card</Card>
```

## Utility Classes

### Pre-built Component Classes

These classes are available in `index.css`:

#### Buttons
- `.btn` - Base button styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-outline` - Outline button
- `.btn-ghost` - Ghost button

#### Inputs
- `.input` - Base input styles

#### Cards
- `.card` - Base card styles

#### Layout
- `.container-custom` - Responsive container with max-width

### Usage

```tsx
// Using utility classes directly
<button className="btn-primary">Click me</button>
<input className="input" type="text" />
<div className="card">Content</div>
```

## Utility Functions

### `cn()` - Class Name Merger

Located in `src/lib/utils.ts`

Merges Tailwind classes intelligently, resolving conflicts:

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  condition && 'conditional-class',
  'another-class'
)}>
  Content
</div>
```

## Best Practices

1. **Use UI Components** - Prefer using the provided UI components over raw HTML elements
2. **Consistent Spacing** - Use Tailwind's spacing scale (p-4, m-2, gap-4, etc.)
3. **Semantic Colors** - Use semantic color names (`text-primary`, `bg-surface`) for better theme support
4. **Responsive Design** - Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, etc.)
5. **Component Variants** - Use component variants instead of custom classes when possible

## Example: Refactored Login Page

```tsx
import { Button, Input, Card, CardHeader, CardTitle } from '@/components/ui';
import { useSignIn } from '@/authentication/hooks/useAuth';
import { useForm } from 'react-hook-form';

export const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn, isPending } = useSignIn();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(signIn)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message}
          />
          <Button 
            type="submit" 
            className="w-full"
            isLoading={isPending}
          >
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
};
```

## Dark Mode (Ready to Implement)

The system is prepared for dark mode. To enable:

1. Add a theme toggle component
2. Toggle `data-theme="dark"` on the root element
3. CSS variables will automatically switch

```tsx
// Toggle dark mode
document.documentElement.setAttribute('data-theme', 'dark');
```

## Extending the System

### Adding New Colors

1. Add color values to `tailwind.config.js`
2. Add CSS variables to `index.css` if needed for theming
3. Update component variants if necessary

### Adding New Components

1. Create component in `src/components/ui/`
2. Export from `src/components/ui/index.ts`
3. Follow existing patterns for variants and props
4. Use `cn()` utility for class merging

### Adding New Utility Classes

Add to `@layer components` in `index.css`:

```css
@layer components {
  .my-custom-class {
    @apply base-styles;
  }
}
```
