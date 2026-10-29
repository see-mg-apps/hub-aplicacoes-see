# Hub de Aplicações da SEE-MG

Primeira versão para homologação da interface do catálogo de aplicações da Secretaria de Estado de Educação de Minas Gerais. React, TypeScript e Vite, com CSS responsivo e ícones Lucide incluídos no bundle. A identidade visual é uma proposta inspirada nas cores de Minas Gerais; não utiliza uma assinatura oficial homologada.

## Desenvolvimento

Requisitos: Node.js 22.12 ou superior e npm. Versão de referência do CI: Node.js 22.

```sh
npm ci
npm run dev
```

O Vite serve a aplicação no caminho `/hub-aplicacoes-see/`. Utilize o endereço informado pelo terminal, acrescido desse caminho quando necessário.

```sh
npm test              # testes de comportamento com Vitest e Testing Library
npm run build         # verificação TypeScript e build em dist/
npm run preview       # servir o build localmente
npm run format:check  # conferir formatação
```

## Funcionalidades

- Catálogo inicial com quatro aplicações fictícias, todas em Demonstração.
- Busca por nome e descrição, insensível a maiúsculas e acentos; filtros por categoria e estado vazio com recuperação.
- Cards com categoria, ambiente e acesso desabilitado quando não há URL. Nenhum link real foi inventado.
- Painel administrativo demonstrativo com inclusão, edição, status, ordem, ícones e exclusão confirmada.
- Campos obrigatórios, limites de texto, ordem inteira positiva e URLs completas HTTP(S) sem credenciais. Links válidos abrem em nova aba com `noopener noreferrer`.
- Layout adaptável, navegação por teclado, foco visível, rótulos de formulário, mensagens de validação associadas, anúncios de resultados e preferência por movimento reduzido.

**O painel é público e não possui autenticação, autorização ou segurança administrativa.** As alterações existem apenas na memória da aba; atualizar a página restaura os dados fictícios. Não há localStorage, banco, chamadas de API, credenciais ou integração com serviços externos. Não insira dados reais ou sensíveis. Ativar uma aplicação apenas controla sua presença no catálogo local; não constitui controle de acesso.

## Organização

```text
src/
  components/       # cards, ícones e painel de demonstração
  data/             # catálogo fictício inicial
  services/         # leitura local, busca, ordenação e validação de URL
  types.ts          # contrato tipado do catálogo e opções dos campos
  App.tsx           # composição do portal e estado em memória
  App.test.tsx      # testes dos fluxos de catálogo e administração
  styles.css        # identidade visual e breakpoints
```

`localCatalog.load()` é a fronteira de leitura para um futuro adaptador de dados. Nesta versão, a escrita é exclusivamente estado React. A integração com Apps Script/Sheets deverá substituir essa fronteira por um serviço assíncrono, definir estados de carregamento/erro e validar os dados recebidos. Qualquer administração real precisará de autenticação e autorização verificadas no servidor antes de habilitar escrita remota. Nunca adicione segredos ao frontend ou a variáveis `VITE_*`, que são públicas no bundle.

## GitHub Pages

O `base` do Vite já está definido como `/hub-aplicacoes-see/`. A alternância entre catálogo e painel é interna ao React, sem rotas de servidor que causem 404 no Pages.

1. Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**.
2. Abra e revise um Pull Request da branch de implementação para `main`.
3. O workflow `.github/workflows/deploy.yml` instala com `npm ci`, executa os testes e gera o build nos PRs.
4. Após o merge em `main`, o mesmo workflow publica `dist/` no Pages. Também é possível executá-lo manualmente na `main`.

A publicação utiliza o token temporário e as permissões nativas do GitHub Actions (`pages: write` e `id-token: write` apenas no job de deploy). Não é necessário cadastrar credenciais no código. PRs não publicam. A ativação do Pages e a execução remota do workflow precisam ser verificadas no GitHub; build local não comprova publicação.

## Abrir o Pull Request

```sh
git push -u origin feat/primeira-versao-hub
```

No GitHub, selecione **Compare & pull request**, com base `main` e comparação `feat/primeira-versao-hub`. Título sugerido: **feat: primeira versão do Hub de Aplicações da SEE-MG**. Descreva o catálogo, o caráter público e temporário do painel, os testes executados e a configuração de Pages.

## Roteiro de homologação

- Conferir os quatro cards, filtros combinados com pesquisa e mensagem de nenhum resultado.
- Conferir os ambientes e os botões de acesso indisponíveis nos dados iniciais.
- Abrir o painel e conferir o aviso de protótipo; adicionar, editar, ativar/desativar e excluir um registro fictício.
- Verificar campos vazios, URL inválida, ordem zero e cancelamento da exclusão.
- Retornar ao catálogo e verificar as alterações da sessão; recarregar e confirmar a restauração.
- Conferir celular, tablet e desktop, zoom e navegação por Tab.
