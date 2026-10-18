# PROJECT STATE — BioPro

- **Objetivo:** Criar mini sites atraentes para links da bio do Instagram, reutilizando um motor para vários clientes.
- **Stack:** HTML, CSS, JavaScript, GitHub Pages e Supabase.
- **Arquitetura:** Site estático multi-cliente; dados/configuração no Supabase; painel autenticado para gerenciar clientes e editar páginas.
- **Funcionalidades:** Temas (incluindo Climatização & Energia), links, serviços, upload de logo, destaque e portfólio para Supabase Storage, localização, redes sociais, editor, preview, publicação e gerenciador com busca, filtros e duplicação de clientes.
- **Estado atual:** Gerenciador permite localizar por nome/slug, filtrar publicados e rascunhos e duplicar um cliente como rascunho. Editor envia logo (`{cliente}/logo/`), destaque e fotos do portfólio ao bucket `biopro-assets`; `PROMPT_CRIACAO_TEMA.md` define formato inicial para temas.
- **Decisões importantes:** Um motor compartilhado para todos os clientes; novos clientes recebem slugs legíveis e números apenas em caso de duplicidade; iniciar com hospedagem gratuita do GitHub Pages e manter suporte a domínio próprio no futuro.
- **Problemas conhecidos:** Não há arquivos SQL das políticas Supabase no repositório, então RLS, Storage e a constraint global de slug não foram confirmados. O catálogo de temas permanece estático no código.
- **Riscos:** A chave publishable do Supabase é pública por natureza; a segurança depende das políticas RLS/Storage e de slug único, que precisam ser verificadas no banco.
- **Próximo passo:** Criar importação de temas JSON com validação e prévia; confirmar RLS, políticas de Storage e unicidade global de slug no Supabase.
