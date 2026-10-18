# Biopro
Sistema de páginas Link na Bio

## Temas personalizados

O gerenciador de temas fica em `editor/temas.html`. Antes de salvar o primeiro tema, execute uma vez `supabase/migrations/20261018_create_biopro_themes.sql` no SQL Editor do projeto Supabase. A migração cria a tabela `biopro_themes` e suas políticas RLS para leitura pública de temas ativos e edição pelo proprietário.

Depois da migração, importe ou cole o JSON do tema, valide-o, confira a prévia e salve. O formato aceito inclui somente as propriedades de tema usadas pelo BioPro; cores, contraste e fontes são verificados antes de gravar. Temas personalizados ativos aparecem no editor e nas páginas públicas dos clientes.

## Cadastro de clientes

No gerenciador, o cadastro inicial aceita descrição, WhatsApp, Instagram e localização. Após salvar, o BioPro abre o editor, onde é possível enviar a logo e a imagem de destaque e acompanhar a prévia antes de salvar as alterações.
