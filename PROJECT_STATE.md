# PROJECT STATE — BioPro

- **Objetivo:** Criar mini sites atraentes para links da bio do Instagram, reutilizando um motor para vários clientes.
- **Stack:** HTML, CSS, JavaScript, GitHub Pages e Supabase.
- **Arquitetura:** Site estático multi-cliente; dados/configuração no Supabase; painel autenticado para gerenciar clientes e editar páginas.
- **Funcionalidades:** Temas, links, serviços, upload de logo, destaque e portfólio para Supabase Storage, localização, redes sociais, editor, preview e publicação.
- **Estado atual:** Editor envia logo (`{cliente}/logo/`), destaque e fotos do portfólio ao bucket `biopro-assets`, mostra miniaturas e atualiza o preview; é necessário salvar para persistir as URLs. `PROMPT_CRIACAO_TEMA.md` define um formato JSON inicial para temas.
- **Decisões importantes:** Um motor compartilhado para todos os clientes; iniciar com hospedagem gratuita do GitHub Pages e manter suporte a domínio próprio no futuro.
- **Problemas conhecidos:** Não há arquivos SQL das políticas Supabase no repositório, então RLS, Storage e a constraint global de slug não foram confirmados. O catálogo de temas permanece estático no código.
- **Riscos:** A chave publishable do Supabase é pública por natureza; a segurança depende das políticas RLS/Storage e de slug único, que precisam ser verificadas no banco.
- **Próximo passo:** Confirmar RLS, políticas de Storage e unicidade global de slug no Supabase; validar os uploads e planejar um catálogo de temas com JSON validado e prévia.
