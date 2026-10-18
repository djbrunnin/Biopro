-- Execute uma vez no SQL Editor do Supabase.
-- Temas são dados de estilo, nunca código executável.

create table if not exists public.biopro_themes (
    theme_key text primary key,
    name text not null,
    theme jsonb not null,
    owner_id uuid not null references auth.users(id) on delete cascade,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    constraint biopro_themes_key_format check (
        theme_key ~ '^[a-z][a-zA-Z0-9]{0,39}$'
        and theme_key not in (
            'botanic', 'luxury', 'romantic', 'barber',
            'oceanGold', 'climatizacaoEnergia'
        )
    ),
    constraint biopro_themes_name_matches check (
        char_length(name) between 1 and 60
        and name = theme ->> 'nome'
    ),
    constraint biopro_themes_shape check (
        jsonb_typeof(theme) = 'object'
        and pg_column_size(theme) <= 32768
        and theme ?& array['nome', 'cores', 'fontes', 'estilo']
        and jsonb_typeof(theme -> 'nome') = 'string'
        and jsonb_typeof(theme -> 'cores') = 'object'
        and (theme -> 'cores') ?& array[
            'background', 'surface', 'primary', 'primaryDark',
            'secondary', 'text', 'textLight', 'border'
        ]
        and coalesce(theme #>> '{cores,background}' ~* '^#[0-9a-f]{6}$', false)
        and coalesce(theme #>> '{cores,surface}' ~* '^#[0-9a-f]{6}$', false)
        and coalesce(theme #>> '{cores,primary}' ~* '^#[0-9a-f]{6}$', false)
        and coalesce(theme #>> '{cores,primaryDark}' ~* '^#[0-9a-f]{6}$', false)
        and coalesce(theme #>> '{cores,secondary}' ~* '^#[0-9a-f]{6}$', false)
        and coalesce(theme #>> '{cores,text}' ~* '^#[0-9a-f]{6}$', false)
        and coalesce(theme #>> '{cores,textLight}' ~* '^#[0-9a-f]{6}$', false)
        and coalesce(theme #>> '{cores,border}' ~* '^#[0-9a-f]{6}$', false)
        and (
            not ((theme -> 'cores') ? 'accentGold')
            or coalesce(theme #>> '{cores,accentGold}' ~* '^#[0-9a-f]{6}$', false)
        )
        and (
            not ((theme -> 'cores') ? 'highlightBackground')
            or coalesce(theme #>> '{cores,highlightBackground}' ~* '^#[0-9a-f]{6}$', false)
        )
        and (
            not ((theme -> 'cores') ? 'highlightText')
            or coalesce(theme #>> '{cores,highlightText}' ~* '^#[0-9a-f]{6}$', false)
        )
        and jsonb_typeof(theme -> 'fontes') = 'object'
        and coalesce(theme #>> '{fontes,principal}' in (
            'Arial, sans-serif',
            'Georgia, serif',
            'Verdana, sans-serif',
            'Tahoma, sans-serif',
            'Trebuchet MS, sans-serif',
            'system-ui, sans-serif'
        ), false)
        and jsonb_typeof(theme -> 'estilo') = 'object'
        and coalesce(theme #>> '{estilo,raio}' ~ '^[0-9]+(\.[0-9]+)?(px|rem|em)$', false)
        and coalesce(
            theme #>> '{estilo,sombra}' ~
                '^(none|0( -?[0-9]+(\.[0-9]+)?px){2,3} rgba\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(0(\.[0-9]+)?|1(\.0+)?)\)\))$',
            false
        )
    )
);

alter table public.biopro_themes enable row level security;

drop policy if exists "Active BioPro themes are public" on public.biopro_themes;
create policy "Active BioPro themes are public"
    on public.biopro_themes
    for select
    using (is_active or auth.uid() = owner_id);

drop policy if exists "Users can create their own BioPro themes" on public.biopro_themes;
create policy "Users can create their own BioPro themes"
    on public.biopro_themes
    for insert
    to authenticated
    with check (auth.uid() = owner_id and is_active);

grant select on public.biopro_themes to anon, authenticated;
grant insert on public.biopro_themes to authenticated;
