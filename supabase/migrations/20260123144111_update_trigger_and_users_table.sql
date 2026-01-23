alter table "public"."users" drop constraint if exists "users_destination_id_fkey";

alter table "public"."users" drop column if exists "destination_id";

alter table "public"."users" drop column if exists "home_city_id";

set check_function_bodies = off;


CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id
    AND email_confirmed_at IS NULL;

  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$function$
;

DROP POLICY IF EXISTS "Enable insert for authenticated users only"
ON public.places;

CREATE POLICY "Enable insert for authenticated users only"
ON public.places
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (true);


DROP POLICY IF EXISTS "Enable read access for all users"
ON public.user_destinations;


CREATE POLICY "Enable read access for all users"
ON public.user_destinations
AS PERMISSIVE
FOR SELECT
TO public
USING (true);


DROP POLICY IF EXISTS "Enable read access for all users"
ON public.user_home;

CREATE POLICY "Enable read access for all users"
on public.user_home
AS PERMISSIVE
FOR ALL
TO public
USING (true)
WITH CHECK (true);


-- drop trigger if exists "on_auth_user_created" on "auth"."users";


