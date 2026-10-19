# Biopro
Sistema de páginas Link na Bio

## Temas personalizados

O gerenciador de temas fica em `editor/temas.html`. Antes de salvar o primeiro tema, execute uma vez `supabase/migrations/20261018_create_biopro_themes.sql` no SQL Editor do projeto Supabase. A migração cria a tabela `biopro_themes` e suas políticas RLS para leitura pública de temas ativos e edição pelo proprietário.

Depois da migração, importe ou cole o JSON do tema, valide-o, confira a prévia e salve. O formato aceito inclui somente as propriedades de tema usadas pelo BioPro; cores, contraste e fontes são verificados antes de gravar. Temas personalizados ativos aparecem no editor e nas páginas públicas dos clientes.

## Cadastro de clientes

No gerenciador, o cadastro inicial aceita descrição, WhatsApp, Instagram e localização. Após salvar, o BioPro abre o editor, onde é possível enviar a logo e a imagem de destaque e acompanhar a prévia antes de salvar as alterações.

## Publicação e divulgação

O editor permite personalizar o texto, ícone e cores dos botões de contato, além de adicionar, editar e remover redes sociais. O checklist aponta nome, descrição, logo e botão de contato ausentes; a publicação fica bloqueada até os itens essenciais estarem preenchidos. No gerenciador, páginas publicadas têm um link de QR Code em PNG de alta resolução para salvar ou imprimir. A geração usa o serviço externo `api.qrserver.com` e envia somente a URL pública da página.

Métricas de visualizações e cliques continuam planejadas para uma etapa futura.
