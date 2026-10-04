# Apuração Eleições 2026

Painel de apuração (Brasil e Mato Grosso) com dados oficiais do TSE. Site estático, sem build e sem dependências.

## Estrutura
- `public/index.html`: a aplicação inteira (HTML + CSS + JS num arquivo só).
- `vercel.json`: publica `public/` e repassa `/tse/*` e `/tse-sim/*` para os servidores do TSE (evita bloqueio de CORS no navegador).
- `scripts/check.mjs`: verificação de sintaxe, URLs e parser. Rode `node scripts/check.mjs` antes de cada commit.
- `.github/workflows/check.yml`: roda a mesma verificação no GitHub.

## Como os dados chegam
- Fonte oficial: `https://resultados.tse.jus.br/oficial/ele2026/<eleição>/dados/<uf>/<uf>-c<cargo>-e<eleição>-u.json` (aqui acessada via `/tse/oficial/ele2026/...`).
- Eleições do 1º turno: `6257` (federal: Presidente) e `6259` (estadual: Governador, Senador, Deputados). O arquivo `comum/config/ele-c.json` do TSE lista `6258` e `6260` como segundo turno (campo `cdt2`); confirmar antes de usar.
- Cargos: `c0001` Presidente (UF `br`), `c0003` Governador, `c0005` Senador, `c0006` Deputado Federal, `c0007` Deputado Estadual (UF `mt`).
- Simulado do TSE (para testes): base `/tse-sim/simulado/simulado2026/ele2026`, eleições `21270` (federal) e `21272` (estadual).
- Limite do TSE: 100 requisições por segundo por IP. Muitos erros 404 seguidos podem bloquear o IP por 10 minutos, então monte as URLs com cuidado.

## Comportamento
- Lê os 5 cargos em paralelo a cada 60 s (`REFRESH_SECONDS`).
- Duas telas: detalhada (uma aba por cargo) e Painel Top 3 (`#top3-<cargo>`), que lista todos os candidatos e destaca os que estão dentro das vagas.
- Regra de destaque (`t3Plan`): se o TSE já marcou eleitos (`e === "s"`), vale o que o TSE informa; senão, os N mais votados com votos > 0 (N = vagas). Para deputados isso é só uma projeção.
- Fotos: `<base>/<eleição>/fotos/<uf>/<sqcand>.jpeg` (padrão das eleições anteriores, não confirmado em 2026). Se falhar, aparecem as iniciais.

## Convenções
- Textos da interface em português do Brasil. Horários exibidos no fuso de Cuiabá; os dados do TSE vêm no horário de Brasília.
- Cores e tipografia ficam em variáveis CSS no `:root`, com versões para tema claro e escuro. Não use cores fixas nos componentes.
- Nada de bibliotecas externas além das fontes do Google. Mantenha o arquivo único, a menos que fique difícil de manter.
- Não adicione cabeçalhos ou chamadas que gerem muitas requisições novas ao TSE.

## Pendências
- Segundo turno (25/10/2026): trocar os códigos de eleição e conferir o formato dos arquivos.
- Confirmar o caminho das fotos e a contagem de candidatos com os dados reais.
