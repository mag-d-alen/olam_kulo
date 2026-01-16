alter table "public"."users" add column "destination_id" uuid;

alter table "public"."users" add constraint "users_destination_id_fkey" FOREIGN KEY (destination_id) REFERENCES public.places(id) not valid;

alter table "public"."users" validate constraint "users_destination_id_fkey";

alter table "public"."users" add column "destination_country" text;



