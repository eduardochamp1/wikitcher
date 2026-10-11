---
tipo: guia
tags: [guia]
---
# Como usar esta wiki

## Estrutura de pastas
```
00 - Início/                 índice, guia de cânone, este arquivo
01 - Linha do Tempo/         cronologia mestra
02 - Cosmologia e Conceitos/ forças, leis e ideias que movem o mundo
03 - Eventos/                guerras, golpes, batalhas, marcos
04 - Personagens/            um arquivo por personagem (subpastas por grupo)
05 - Lugares/                reinos, cidades, fortalezas, regiões
06 - Raças e Criaturas/      povos e monstros
07 - Organizações/           escolas, conselhos, ordens, bandos
08 - Obras/                  livros e jogos (resumos e ordem)
09 - Glossário/              Língua Antiga e termos
99 - Modelos/                templates para novas páginas
```

## Convenções
- **Links**: `[[Nome da Página]]` — compatível com Obsidian, Foam, Dendron, Quartz, Docusaurus (com plugin) e MkDocs (com `roamlinks`).
- **Cabeçalho YAML** em toda página: `tipo`, `fonte`, `aliases`, `tags`. Serve para consultas (Dataview) e para gerar menus num site.
- **Callouts**: `> [!jogos]` para conteúdo só dos jogos; `> [!spoiler]` para revelações de enredo; `> [!divergencia]` para contradições.
- **Links vermelhos**: um link para uma página que ainda não existe é intencional — marca um verbete a ser escrito.

## Publicando como site
Esta pasta funciona direto como cofre do Obsidian. Para virar site estático:
- **Quartz 4** (mais simples para wikilinks e grafo): copie as pastas para `content/` e rode `npx quartz build --serve`.
- **Next.js** com `next-mdx-remote` + um passo que converte `[[links]]` em rotas — útil se quiser busca, filtros por era/fonte e grafo customizado.

## Modelos
Use os arquivos em `99 - Modelos/` para criar páginas novas mantendo o mesmo formato: [[Modelo - Personagem]], [[Modelo - Lugar]], [[Modelo - Evento]].
