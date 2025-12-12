# How to Find Your Supabase Project Reference

## Method 1: From Dashboard URL (Easiest)

1. Go to your Supabase project dashboard
2. Look at the URL in your browser
3. It will look like: `https://supabase.com/dashboard/project/abcdefghijklmnop`
4. The part after `/project/` is your **project-ref**: `abcdefghijklmnop`

## Method 2: From Project Settings

1. Go to your Supabase project dashboard
2. Click **Settings** (gear icon) in the left sidebar
3. Click **General**
4. Look for **Reference ID** or **Project ID**
5. That's your project-ref!

## Method 3: From API Settings

1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Look at the **Project URL**
4. It looks like: `https://abcdefghijklmnop.supabase.co`
5. The subdomain part (`abcdefghijklmnop`) is your project-ref

## Example

If your project URL is:
```
https://xyzabc123456789.supabase.co
```

Then your project-ref is:
```
xyzabc123456789
```

## Using with Supabase CLI

Once you have your project-ref, you can link your project:

```bash
supabase link --project-ref xyzabc123456789
```

Then apply migrations:

```bash
supabase db push
```


