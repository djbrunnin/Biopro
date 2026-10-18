# PROJECT STATE — BioPro

- **Objetivo:** Criar mini sites atraentes para links da bio do Instagram, reutilizando um motor para vários clientes.
- **Stack:** HTML, CSS, JavaScript, GitHub Pages e Supabase.
- **Arquitetura:** Site estático multi-cliente; dados/configuração no Supabase; painel autenticado para gerenciar clientes e editar páginas.
- **Funcionalidades:** Catálogo estático e gerenciador de temas personalizados via JSON, com validação e prévia; gerenciador de clientes com busca, filtros, duplicação e cadastro inicial de contatos/localização; editor com uploads e prévia.
- **Estado atual:** Cadastro inicial coleta descrição, WhatsApp, Instagram e localização e abre o editor para envio de logo/destaque e prévia. Importador de temas valida sombras `rgba` coloridas em formato simples; a tabela `biopro_themes` precisa ser criada aplicando a migração SQL no Supabase.
- **Decisões importantes:** Um motor compartilhado para todos os clientes; novos clientes recebem slugs legíveis e números apenas em caso de duplicidade; iniciar com hospedagem gratuita do GitHub Pages e manter suporte a domínio próprio no futuro.
- **Problemas conhecidos:** As políticas RLS/Storage de clientes e unicidade global do slug ainda precisam ser confirmadas no Supabase. O gerenciador de temas depende da migração `supabase/migrations/20261018_create_biopro_themes.sql` ser aplicada.
- **Riscos:** A chave publishable do Supabase é pública por natureza; a segurança depende das políticas RLS/Storage e de slug único, que precisam ser verificadas no banco.
- **Próximo passo:** Aplicar a migração de temas no Supabase e validar importação, prévia e renderização pública; depois confirmar RLS/Storage e unicidade global de slug.
