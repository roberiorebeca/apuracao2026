# Apuração Eleições 2026

Painel de apuração das eleições de 04/10/2026 (Presidente, Governador, Senador, Deputado Federal e Deputado Estadual de Mato Grosso), com dados oficiais do TSE e atualização a cada 60 segundos.

## Publicar na Vercel com deploy automático

1. Crie um repositório vazio no GitHub e envie este código:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/apuracao-eleicoes-2026.git
   git push -u origin main
   ```
2. Na Vercel, clique em **Add New → Project** e importe o repositório.
3. Deixe **Framework Preset: Other**. Não precisa de Build Command. O `vercel.json` já define `public` como pasta de saída.
4. Clique em **Deploy**.

Depois disso, cada `git push` na branch `main` publica em produção, e cada Pull Request gera um link de prévia.

## Testar

```bash
node scripts/check.mjs   # sintaxe, URLs e parser
npx vercel dev           # abre o site local com os repasses para o TSE
```

Na tela, o seletor **Fonte dos dados** alterna entre a apuração oficial e o simulado do TSE.
