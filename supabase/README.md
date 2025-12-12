# Supabase Migrations

This directory contains SQL migrations for your Supabase database.

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of the migration file
4. Run the SQL

### Option 2: Using Supabase CLI

#### Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Or using npm
npm install -g supabase
```

#### Link to your project

```bash
cd /path/to/OlamKulo
supabase link --project-ref your-project-ref
```

#### Run migrations

```bash
# Apply all pending migrations
supabase db push

# Or apply a specific migration
supabase migration up
```

### Option 3: Using psql (Direct Database Connection)

If you have direct database access:

```bash
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/20241210000000_disable_email_confirmation.sql
```

## Disabling Email Confirmation via Dashboard

1. Go to **Authentication** > **Settings** in your Supabase Dashboard
2. Under **Email Auth**, find **"Enable email confirmations"**
3. **Disable** this setting
4. Save changes

This is the recommended approach as it's simpler and doesn't require database migrations.

## Migration Files

- `20241210000000_disable_email_confirmation.sql` - Auto-confirms users on signup, creates `public.users` table, and automatically inserts new users into it

### What This Migration Does

1. **Creates `public.users` table** - A public profile table that mirrors auth users
   - `id` (UUID, references `auth.users.id`)
   - `email` (TEXT)
   - `created_at` (TIMESTAMPTZ)
   - `updated_at` (TIMESTAMPTZ)
   - `metadata` (JSONB) - Stores additional user profile data

2. **Sets up Row Level Security (RLS)** - Users can only view/update their own profile

3. **Auto-confirms email** - Users don't need to confirm their email before signing in

4. **Auto-creates profile** - When a new user signs up in `auth.users`, a corresponding record is automatically created in `public.users`

5. **Migrates existing users** - Any existing auth users are automatically added to `public.users`

## Using the public.users Table

After running the migration, you can query user profiles from `public.users`:

```sql
-- Get current user's profile
SELECT * FROM public.users WHERE id = auth.uid();

-- Update user profile
UPDATE public.users 
SET metadata = jsonb_set(metadata, '{full_name}', '"John Doe"')
WHERE id = auth.uid();
```

The `public.users` table is automatically synced with `auth.users` via the trigger function.

## Important Notes

- The trigger-based approach (in the migration) will auto-confirm users even if email confirmation is enabled in settings
- For production, consider using the Dashboard setting instead for better control
- Always test migrations in a development/staging environment first
- The `public.users` table uses Row Level Security (RLS) - users can only access their own data
- To add more fields to `public.users`, create a new migration that alters the table

