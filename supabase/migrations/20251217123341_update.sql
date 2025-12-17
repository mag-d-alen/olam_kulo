drop extension if exists "pg_net";

alter table "public"."users" drop column "metadata";

alter table "public"."users" drop column "updated_at";

alter table "public"."users" add column "home_city" text;

alter table "public"."users" add column "home_country" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Auto-confirm the email immediately
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id
  AND email_confirmed_at IS NULL;
  
  INSERT INTO public.users (id, email, home_city, home_country)
  VALUES (
    NEW.id,
    NEW.email,
    NULL,
    NULL
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$function$
;


