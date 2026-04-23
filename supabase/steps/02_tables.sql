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
