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
