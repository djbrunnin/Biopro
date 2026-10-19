# PROJECT STATE — BioPro

- **Objetivo:** Criar mini sites atraentes para links da bio do Instagram, reutilizando um motor para vários clientes.
- **Stack:** HTML, CSS, JavaScript, GitHub Pages e Supabase.
- **Arquitetura:** Site estático multi-cliente; dados/configuração no Supabase; painel autenticado para gerenciar clientes e editar páginas.
- **Funcionalidades:** Catálogo estático e gerenciador de temas personalizados via JSON, com validação e prévia; gerenciador de clientes com busca, filtros, duplicação e QR Code; editor com uploads, prévia, personalização visual dos botões, gestão de redes sociais e checklist de publicação.
- **Estado atual:** Checklist exibe nome, descrição, logo e botão válido, bloqueando publicação quando faltam itens essenciais. QR Code PNG de páginas publicadas é gerado por serviço externo usando a URL pública. Analytics de visualizações e cliques ficam para etapa posterior. A migração corretiva dos temas personalizados precisa ser aplicada no Supabase existente.
- **Decisões importantes:** Um motor compartilhado para todos os clientes; novos clientes recebem slugs legíveis e números apenas em caso de duplicidade; iniciar com hospedagem gratuita do GitHub Pages e manter suporte a domínio próprio no futuro.
- **Problemas conhecidos:** As políticas RLS/Storage de clientes e unicidade global do slug ainda precisam ser confirmadas no Supabase. O gerenciador de temas depende da migração inicial e, em bancos já existentes, da atualização `supabase/migrations/20261018_allow_colored_theme_shadows.sql`.
- **Riscos:** A chave publishable do Supabase é pública por natureza; a segurança depende das políticas RLS/Storage e de slug único, que precisam ser verificadas no banco.
- **Próximo passo:** Aplicar a migração de temas no Supabase e validar importação, prévia e renderização pública; depois confirmar RLS/Storage e unicidade global de slug.
