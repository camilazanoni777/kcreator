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
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = id)
  with check (auth.uid() is not null and auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own" on public.profiles
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = id);

drop policy if exists "tarefas_select_own" on public.tarefas;
create policy "tarefas_select_own" on public.tarefas
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "tarefas_insert_own" on public.tarefas;
create policy "tarefas_insert_own" on public.tarefas
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "tarefas_update_own" on public.tarefas;
create policy "tarefas_update_own" on public.tarefas
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "tarefas_delete_own" on public.tarefas;
create policy "tarefas_delete_own" on public.tarefas
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "metas_select_own" on public.metas;
create policy "metas_select_own" on public.metas
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "metas_insert_own" on public.metas;
create policy "metas_insert_own" on public.metas
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "metas_update_own" on public.metas;
create policy "metas_update_own" on public.metas
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "metas_delete_own" on public.metas;
create policy "metas_delete_own" on public.metas
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "ideias_select_own" on public.ideias;
create policy "ideias_select_own" on public.ideias
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "ideias_insert_own" on public.ideias;
create policy "ideias_insert_own" on public.ideias
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "ideias_update_own" on public.ideias;
create policy "ideias_update_own" on public.ideias
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "ideias_delete_own" on public.ideias;
create policy "ideias_delete_own" on public.ideias
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "habitos_select_own" on public.habitos;
create policy "habitos_select_own" on public.habitos
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "habitos_insert_own" on public.habitos;
create policy "habitos_insert_own" on public.habitos
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "habitos_update_own" on public.habitos;
create policy "habitos_update_own" on public.habitos
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "habitos_delete_own" on public.habitos;
create policy "habitos_delete_own" on public.habitos
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "checkins_select_own" on public.checkins;
create policy "checkins_select_own" on public.checkins
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "checkins_insert_own" on public.checkins;
create policy "checkins_insert_own" on public.checkins
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "checkins_update_own" on public.checkins;
create policy "checkins_update_own" on public.checkins
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "checkins_delete_own" on public.checkins;
create policy "checkins_delete_own" on public.checkins
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "salarios_select_own" on public.salarios;
create policy "salarios_select_own" on public.salarios
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "salarios_insert_own" on public.salarios;
create policy "salarios_insert_own" on public.salarios
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "salarios_update_own" on public.salarios;
create policy "salarios_update_own" on public.salarios
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "salarios_delete_own" on public.salarios;
create policy "salarios_delete_own" on public.salarios
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "gastos_variaveis_select_own" on public.gastos_variaveis;
create policy "gastos_variaveis_select_own" on public.gastos_variaveis
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "gastos_variaveis_insert_own" on public.gastos_variaveis;
create policy "gastos_variaveis_insert_own" on public.gastos_variaveis
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "gastos_variaveis_update_own" on public.gastos_variaveis;
create policy "gastos_variaveis_update_own" on public.gastos_variaveis
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "gastos_variaveis_delete_own" on public.gastos_variaveis;
create policy "gastos_variaveis_delete_own" on public.gastos_variaveis
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "contas_fixas_select_own" on public.contas_fixas;
create policy "contas_fixas_select_own" on public.contas_fixas
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "contas_fixas_insert_own" on public.contas_fixas;
create policy "contas_fixas_insert_own" on public.contas_fixas
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "contas_fixas_update_own" on public.contas_fixas;
create policy "contas_fixas_update_own" on public.contas_fixas
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "contas_fixas_delete_own" on public.contas_fixas;
create policy "contas_fixas_delete_own" on public.contas_fixas
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "entradas_extras_select_own" on public.entradas_extras;
create policy "entradas_extras_select_own" on public.entradas_extras
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "entradas_extras_insert_own" on public.entradas_extras;
create policy "entradas_extras_insert_own" on public.entradas_extras
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "entradas_extras_update_own" on public.entradas_extras;
create policy "entradas_extras_update_own" on public.entradas_extras
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "entradas_extras_delete_own" on public.entradas_extras;
create policy "entradas_extras_delete_own" on public.entradas_extras
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "dividas_select_own" on public.dividas;
create policy "dividas_select_own" on public.dividas
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "dividas_insert_own" on public.dividas;
create policy "dividas_insert_own" on public.dividas
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "dividas_update_own" on public.dividas;
create policy "dividas_update_own" on public.dividas
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "dividas_delete_own" on public.dividas;
create policy "dividas_delete_own" on public.dividas
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "conteudos_select_own" on public.conteudos;
create policy "conteudos_select_own" on public.conteudos
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "conteudos_insert_own" on public.conteudos;
create policy "conteudos_insert_own" on public.conteudos
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "conteudos_update_own" on public.conteudos;
create policy "conteudos_update_own" on public.conteudos
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "conteudos_delete_own" on public.conteudos;
create policy "conteudos_delete_own" on public.conteudos
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "publis_select_own" on public.publis;
create policy "publis_select_own" on public.publis
  for select to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "publis_insert_own" on public.publis;
create policy "publis_insert_own" on public.publis
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "publis_update_own" on public.publis;
create policy "publis_update_own" on public.publis
  for update to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "publis_delete_own" on public.publis;
create policy "publis_delete_own" on public.publis
  for delete to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);
