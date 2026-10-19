# PROJECT STATE — BioPro

- **Objetivo:** Criar mini sites atraentes para links da bio do Instagram, reutilizando um motor para vários clientes.
- **Stack:** HTML, CSS, JavaScript, GitHub Pages e Supabase.
- **Arquitetura:** Site estático multi-cliente; dados/configuração no Supabase; painel autenticado para gerenciar clientes e editar páginas.
- **Funcionalidades:** Hub público com busca e cartões de clientes publicados; escolha de imagem/descrição por cliente; gerenciador de clientes, QR Code, editor de temas e páginas.
- **Estado atual:** Hub usa logo, destaque ou foto já enviada, preserva a proporção integral das imagens, e oferece opção de ocultar cliente e descrição própria. Botões e redes são editáveis; checklist de publicação evita páginas incompletas. Analytics ficam para depois. Identidade final da marca ainda pendente.
- **Decisões importantes:** Um motor compartilhado para todos os clientes; novos clientes recebem slugs legíveis e números apenas em caso de duplicidade; iniciar com hospedagem gratuita do GitHub Pages e manter suporte a domínio próprio no futuro.
- **Problemas conhecidos:** As políticas RLS/Storage de clientes e unicidade global do slug ainda precisam ser confirmadas no Supabase. O gerenciador de temas depende da migração inicial e, em bancos já existentes, da atualização `supabase/migrations/20261018_allow_colored_theme_shadows.sql`.
- **Riscos:** A chave publishable do Supabase é pública por natureza; a segurança depende das políticas RLS/Storage e de slug único, que precisam ser verificadas no banco.
- **Próximo passo:** Validar o Hub no site publicado e criar a identidade visual final da BioPro; confirmar políticas RLS/Storage e unicidade global de slug.
