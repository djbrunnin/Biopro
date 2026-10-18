-- Execute no SQL Editor do Supabase para atualizar a validação de temas já criada.
-- Permite sombras rgba coloridas, mantendo os limites de RGB e opacidade.
alter table public.biopro_themes
    drop constraint if exists biopro_themes_shape;

alter table public.biopro_themes
    add constraint biopro_themes_shape check (
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
                '^(none|0( -?[0-9]+([.][0-9]+)?px){2,3} rgba[(][[:space:]]*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])[[:space:]]*,[[:space:]]*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])[[:space:]]*,[[:space:]]*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])[[:space:]]*,[[:space:]]*(0([.][0-9]+)?|1([.]0+)?)[)])$',
            false
        )
    );
