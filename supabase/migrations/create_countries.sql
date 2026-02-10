create table public.countries (
  id uuid primary key, 
  name text not null,
  geometry jsonb, -- optional, but useful
  created_at timestamptz default now()
);
create index countries_name_idx on public.countries (name);
create type neighbor_type as enum ('land', 'sea');

create table public.country_neighbors (
  country_id uuid not null references public.countries(id) on delete cascade,
  neighbor_id uuid not null references public.countries(id) on delete cascade,
  type neighbor_type not null,
  distance_km numeric, -- null for land borders
  method text not null, -- e.g. 'booleanTouches', 'coastline_distance'
  version text not null, 
  created_at timestamptz default now(),

  primary key (country_id, neighbor_id)
);
create index country_neighbors_country_idx
  on public.country_neighbors (country_id);

create index country_neighbors_neighbor_idx
  on public.country_neighbors (neighbor_id);

create index country_neighbors_type_idx
  on public.country_neighbors (type);

 alter table public.countries enable row level security;
alter table public.country_neighbors enable row level security;

create policy "Authenticated read countries"
on public.countries
for select
using (auth.role() = 'authenticated');

create policy "Authenticated read neighbors"
on public.country_neighbors
for select
using (auth.role() = 'authenticated');

create policy "Service role write countries"
on public.countries
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Service role write neighbors"
on public.country_neighbors
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
