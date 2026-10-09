# PROJECT STATE — BioPro

- **Objetivo:** Criar mini sites atraentes para links da bio do Instagram, reutilizando um motor para vários clientes.
- **Stack:** HTML, CSS, JavaScript, GitHub Pages e Supabase.
- **Arquitetura:** Site estático multi-cliente; dados/configuração no Supabase; painel autenticado para gerenciar clientes e editar páginas.
- **Funcionalidades:** Temas, links, serviços, upload de destaque e portfólio para Supabase Storage, localização, redes sociais, editor, preview e publicação.
- **Estado atual:** Editor agora envia destaque e fotos do portfólio ao bucket `biopro-assets`, mostra miniaturas e atualiza o preview da página; ainda requer salvar a configuração para persistir as URLs do cliente.
- **Decisões importantes:** Um motor compartilhado para todos os clientes; iniciar com hospedagem gratuita do GitHub Pages e manter suporte a domínio próprio no futuro.
- **Problemas conhecidos:** O editor ainda não permite editar/subir logo; não há arquivos SQL das políticas Supabase no repositório, então RLS, Storage e a constraint global de slug não foram confirmados.
- **Riscos:** A chave publishable do Supabase é pública por natureza; a segurança depende das políticas RLS/Storage e de slug único, que precisam ser verificadas no banco.
- **Próximo passo:** Confirmar RLS, políticas de Storage e unicidade global de slug no Supabase; validar uploads e completar o upload de logo.
