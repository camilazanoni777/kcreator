create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default '',
  partner_name text not null default '',
  partner_email text not null default '',
  plano text not null default 'individual' check (plano in ('individual', 'casal')),
  onboarding_done boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tarefas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  descricao text not null,
  responsavel text not null default '',
  prioridade text not null default 'media',
  area text not null default '',
  prazo text,
  hora text,
  rotina text not null default 'unica',
  status text not null default 'pendente',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  titulo text not null,
  valor_total numeric(12, 2) not null default 0,
  valor_atual numeric(12, 2) not null default 0,
  responsavel text not null default '',
  prazo text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ideias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  titulo text not null,
  gancho text,
  descricao text,
  tipo text not null default 'reels',
  categoria text not null default 'Lifestyle',
  plataforma text not null default 'Instagram',
  status text not null default 'rascunho',
  urgencia text not null default 'media',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.habitos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null,
  emoji text,
  frequencia text not null default 'diario',
  categoria text not null default 'Saude',
  meta_dias integer not null default 30,
  dias_feitos integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  data date not null,
  humor text not null,
  energia integer not null default 7 check (energia between 1 and 10),
  nota text,
  modo text not null default 'individual',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, data, modo)
);

create table if not exists public.salarios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  pessoa text not null,
  valor numeric(12, 2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, pessoa)
);

create table if not exists public.gastos_variaveis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  descricao text not null,
  valor numeric(12, 2) not null default 0,
  categoria text not null default 'Outros',
  responsavel text not null default '',
  data date not null default current_date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contas_fixas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null,
  valor numeric(12, 2) not null default 0,
  vencimento date,
  status text not null default 'pendente',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.entradas_extras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  descricao text not null,
  valor numeric(12, 2) not null default 0,
  categoria text not null default 'Outros',
  responsavel text not null default '',
  data date not null default current_date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.dividas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null,
  valor_total numeric(12, 2) not null default 0,
  responsavel text not null default '',
  parcelas_total integer not null default 1,
  parcelas_pagas integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (parcelas_total > 0),
  check (parcelas_pagas >= 0),
  check (parcelas_pagas <= parcelas_total)
);

create table if not exists public.conteudos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  titulo text not null,
  tipo text not null default 'organico',
  receita numeric(12, 2) not null default 0,
  status_receita text not null default 'negociacao',
  etapa text not null default 'ideia',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.publis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  titulo text not null,
  marca text not null default '',
  valor numeric(12, 2) not null default 0,
  status text not null default 'rascunho',
  entrega_em date,
  observacoes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_tarefas_user_id on public.tarefas (user_id);
create index if not exists idx_tarefas_prazo on public.tarefas (prazo);
create index if not exists idx_metas_user_id on public.metas (user_id);
create index if not exists idx_ideias_user_id on public.ideias (user_id);
create index if not exists idx_habitos_user_id on public.habitos (user_id);
create index if not exists idx_checkins_user_id_data on public.checkins (user_id, data desc);
create index if not exists idx_salarios_user_id on public.salarios (user_id);
create index if not exists idx_gastos_variaveis_user_id_data on public.gastos_variaveis (user_id, data desc);
create index if not exists idx_contas_fixas_user_id_vencimento on public.contas_fixas (user_id, vencimento);
create index if not exists idx_entradas_extras_user_id_data on public.entradas_extras (user_id, data desc);
create index if not exists idx_dividas_user_id on public.dividas (user_id);
create index if not exists idx_conteudos_user_id on public.conteudos (user_id);
create index if not exists idx_publis_user_id on public.publis (user_id);

alter table public.profiles enable row level security;
alter table public.tarefas enable row level security;
alter table public.metas enable row level security;
alter table public.ideias enable row level security;
alter table public.habitos enable row level security;
alter table public.checkins enable row level security;
alter table public.salarios enable row level security;
alter table public.gastos_variaveis enable row level security;
alter table public.contas_fixas enable row level security;
alter table public.entradas_extras enable row level security;
alter table public.dividas enable row level security;
alter table public.conteudos enable row level security;
alter table public.publis enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

drop policy if exists "tarefas_select_own" on public.tarefas;
create policy "tarefas_select_own" on public.tarefas
  for select using (auth.uid() = user_id);

drop policy if exists "tarefas_insert_own" on public.tarefas;
create policy "tarefas_insert_own" on public.tarefas
  for insert with check (auth.uid() = user_id);

drop policy if exists "tarefas_update_own" on public.tarefas;
create policy "tarefas_update_own" on public.tarefas
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "tarefas_delete_own" on public.tarefas;
create policy "tarefas_delete_own" on public.tarefas
  for delete using (auth.uid() = user_id);

drop policy if exists "metas_select_own" on public.metas;
create policy "metas_select_own" on public.metas
  for select using (auth.uid() = user_id);

drop policy if exists "metas_insert_own" on public.metas;
create policy "metas_insert_own" on public.metas
  for insert with check (auth.uid() = user_id);

drop policy if exists "metas_update_own" on public.metas;
create policy "metas_update_own" on public.metas
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "metas_delete_own" on public.metas;
create policy "metas_delete_own" on public.metas
  for delete using (auth.uid() = user_id);

drop policy if exists "ideias_select_own" on public.ideias;
create policy "ideias_select_own" on public.ideias
  for select using (auth.uid() = user_id);

drop policy if exists "ideias_insert_own" on public.ideias;
create policy "ideias_insert_own" on public.ideias
  for insert with check (auth.uid() = user_id);

drop policy if exists "ideias_update_own" on public.ideias;
create policy "ideias_update_own" on public.ideias
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ideias_delete_own" on public.ideias;
create policy "ideias_delete_own" on public.ideias
  for delete using (auth.uid() = user_id);

drop policy if exists "habitos_select_own" on public.habitos;
create policy "habitos_select_own" on public.habitos
  for select using (auth.uid() = user_id);

drop policy if exists "habitos_insert_own" on public.habitos;
create policy "habitos_insert_own" on public.habitos
  for insert with check (auth.uid() = user_id);

drop policy if exists "habitos_update_own" on public.habitos;
create policy "habitos_update_own" on public.habitos
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "habitos_delete_own" on public.habitos;
create policy "habitos_delete_own" on public.habitos
  for delete using (auth.uid() = user_id);

drop policy if exists "checkins_select_own" on public.checkins;
create policy "checkins_select_own" on public.checkins
  for select using (auth.uid() = user_id);

drop policy if exists "checkins_insert_own" on public.checkins;
create policy "checkins_insert_own" on public.checkins
  for insert with check (auth.uid() = user_id);

drop policy if exists "checkins_update_own" on public.checkins;
create policy "checkins_update_own" on public.checkins
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "checkins_delete_own" on public.checkins;
create policy "checkins_delete_own" on public.checkins
  for delete using (auth.uid() = user_id);

drop policy if exists "salarios_select_own" on public.salarios;
create policy "salarios_select_own" on public.salarios
  for select using (auth.uid() = user_id);

drop policy if exists "salarios_insert_own" on public.salarios;
create policy "salarios_insert_own" on public.salarios
  for insert with check (auth.uid() = user_id);

drop policy if exists "salarios_update_own" on public.salarios;
create policy "salarios_update_own" on public.salarios
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "salarios_delete_own" on public.salarios;
create policy "salarios_delete_own" on public.salarios
  for delete using (auth.uid() = user_id);

drop policy if exists "gastos_variaveis_select_own" on public.gastos_variaveis;
create policy "gastos_variaveis_select_own" on public.gastos_variaveis
  for select using (auth.uid() = user_id);

drop policy if exists "gastos_variaveis_insert_own" on public.gastos_variaveis;
create policy "gastos_variaveis_insert_own" on public.gastos_variaveis
  for insert with check (auth.uid() = user_id);

drop policy if exists "gastos_variaveis_update_own" on public.gastos_variaveis;
create policy "gastos_variaveis_update_own" on public.gastos_variaveis
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "gastos_variaveis_delete_own" on public.gastos_variaveis;
create policy "gastos_variaveis_delete_own" on public.gastos_variaveis
  for delete using (auth.uid() = user_id);

drop policy if exists "contas_fixas_select_own" on public.contas_fixas;
create policy "contas_fixas_select_own" on public.contas_fixas
  for select using (auth.uid() = user_id);

drop policy if exists "contas_fixas_insert_own" on public.contas_fixas;
create policy "contas_fixas_insert_own" on public.contas_fixas
  for insert with check (auth.uid() = user_id);

drop policy if exists "contas_fixas_update_own" on public.contas_fixas;
create policy "contas_fixas_update_own" on public.contas_fixas
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "contas_fixas_delete_own" on public.contas_fixas;
create policy "contas_fixas_delete_own" on public.contas_fixas
  for delete using (auth.uid() = user_id);

drop policy if exists "entradas_extras_select_own" on public.entradas_extras;
create policy "entradas_extras_select_own" on public.entradas_extras
  for select using (auth.uid() = user_id);

drop policy if exists "entradas_extras_insert_own" on public.entradas_extras;
create policy "entradas_extras_insert_own" on public.entradas_extras
  for insert with check (auth.uid() = user_id);

drop policy if exists "entradas_extras_update_own" on public.entradas_extras;
create policy "entradas_extras_update_own" on public.entradas_extras
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "entradas_extras_delete_own" on public.entradas_extras;
create policy "entradas_extras_delete_own" on public.entradas_extras
  for delete using (auth.uid() = user_id);

drop policy if exists "dividas_select_own" on public.dividas;
create policy "dividas_select_own" on public.dividas
  for select using (auth.uid() = user_id);

drop policy if exists "dividas_insert_own" on public.dividas;
create policy "dividas_insert_own" on public.dividas
  for insert with check (auth.uid() = user_id);

drop policy if exists "dividas_update_own" on public.dividas;
create policy "dividas_update_own" on public.dividas
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "dividas_delete_own" on public.dividas;
create policy "dividas_delete_own" on public.dividas
  for delete using (auth.uid() = user_id);

drop policy if exists "conteudos_select_own" on public.conteudos;
create policy "conteudos_select_own" on public.conteudos
  for select using (auth.uid() = user_id);

drop policy if exists "conteudos_insert_own" on public.conteudos;
create policy "conteudos_insert_own" on public.conteudos
  for insert with check (auth.uid() = user_id);

drop policy if exists "conteudos_update_own" on public.conteudos;
create policy "conteudos_update_own" on public.conteudos
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "conteudos_delete_own" on public.conteudos;
create policy "conteudos_delete_own" on public.conteudos
  for delete using (auth.uid() = user_id);

drop policy if exists "publis_select_own" on public.publis;
create policy "publis_select_own" on public.publis
  for select using (auth.uid() = user_id);

drop policy if exists "publis_insert_own" on public.publis;
create policy "publis_insert_own" on public.publis
  for insert with check (auth.uid() = user_id);

drop policy if exists "publis_update_own" on public.publis;
create policy "publis_update_own" on public.publis
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "publis_delete_own" on public.publis;
create policy "publis_delete_own" on public.publis
  for delete using (auth.uid() = user_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_tarefas_updated_at on public.tarefas;
create trigger set_tarefas_updated_at
before update on public.tarefas
for each row execute function public.set_updated_at();

drop trigger if exists set_metas_updated_at on public.metas;
create trigger set_metas_updated_at
before update on public.metas
for each row execute function public.set_updated_at();

drop trigger if exists set_ideias_updated_at on public.ideias;
create trigger set_ideias_updated_at
before update on public.ideias
for each row execute function public.set_updated_at();

drop trigger if exists set_habitos_updated_at on public.habitos;
create trigger set_habitos_updated_at
before update on public.habitos
for each row execute function public.set_updated_at();

drop trigger if exists set_checkins_updated_at on public.checkins;
create trigger set_checkins_updated_at
before update on public.checkins
for each row execute function public.set_updated_at();

drop trigger if exists set_salarios_updated_at on public.salarios;
create trigger set_salarios_updated_at
before update on public.salarios
for each row execute function public.set_updated_at();

drop trigger if exists set_gastos_variaveis_updated_at on public.gastos_variaveis;
create trigger set_gastos_variaveis_updated_at
before update on public.gastos_variaveis
for each row execute function public.set_updated_at();

drop trigger if exists set_contas_fixas_updated_at on public.contas_fixas;
create trigger set_contas_fixas_updated_at
before update on public.contas_fixas
for each row execute function public.set_updated_at();

drop trigger if exists set_entradas_extras_updated_at on public.entradas_extras;
create trigger set_entradas_extras_updated_at
before update on public.entradas_extras
for each row execute function public.set_updated_at();

drop trigger if exists set_dividas_updated_at on public.dividas;
create trigger set_dividas_updated_at
before update on public.dividas
for each row execute function public.set_updated_at();

drop trigger if exists set_conteudos_updated_at on public.conteudos;
create trigger set_conteudos_updated_at
before update on public.conteudos
for each row execute function public.set_updated_at();

drop trigger if exists set_publis_updated_at on public.publis;
create trigger set_publis_updated_at
before update on public.publis
for each row execute function public.set_updated_at();
