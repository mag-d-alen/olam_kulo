
  create table "public"."user_home" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid default auth.uid(),
    "home_id" uuid
      );


alter table "public"."user_home" enable row level security;

alter table "public"."users" drop column "destination_city";

alter table "public"."users" drop column "destination_country";

alter table "public"."users" drop column "home_city";

alter table "public"."users" drop column "home_country";

alter table "public"."users" add column "home_city_id" uuid default gen_random_uuid();

CREATE UNIQUE INDEX user_home_pkey ON public.user_home USING btree (id);

alter table "public"."user_home" add constraint "user_home_pkey" PRIMARY KEY using index "user_home_pkey";

alter table "public"."user_home" add constraint "user_home_home_id_fkey" FOREIGN KEY (home_id) REFERENCES public.places(id) not valid;

alter table "public"."user_home" validate constraint "user_home_home_id_fkey";

alter table "public"."user_home" add constraint "user_home_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) not valid;

alter table "public"."user_home" validate constraint "user_home_user_id_fkey";

grant delete on table "public"."user_home" to "anon";

grant insert on table "public"."user_home" to "anon";

grant references on table "public"."user_home" to "anon";

grant select on table "public"."user_home" to "anon";

grant trigger on table "public"."user_home" to "anon";

grant truncate on table "public"."user_home" to "anon";

grant update on table "public"."user_home" to "anon";

grant delete on table "public"."user_home" to "authenticated";

grant insert on table "public"."user_home" to "authenticated";

grant references on table "public"."user_home" to "authenticated";

grant select on table "public"."user_home" to "authenticated";

grant trigger on table "public"."user_home" to "authenticated";

grant truncate on table "public"."user_home" to "authenticated";

grant update on table "public"."user_home" to "authenticated";

grant delete on table "public"."user_home" to "service_role";

grant insert on table "public"."user_home" to "service_role";

grant references on table "public"."user_home" to "service_role";

grant select on table "public"."user_home" to "service_role";

grant trigger on table "public"."user_home" to "service_role";

grant truncate on table "public"."user_home" to "service_role";

grant update on table "public"."user_home" to "service_role";


  create policy "Enable insert for authenticated users only"
  on "public"."user_home"
  as permissive
  for insert
  to authenticated
with check (true);



