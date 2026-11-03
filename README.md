# Fundamentos Angular

Laboratório de estudos de **Angular 22**: um projeto executável com uma página para cada fundamento (signals, DI, HTTP,
formulários, rotas, acessibilidade, i18n...), acompanhado de um material teórico em português ancorado na documentação
oficial.

![Angular](https://img.shields.io/badge/Angular-22.2-DD0031)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6)
![Node](https://img.shields.io/badge/Node-24-339933)
![License](https://img.shields.io/badge/license-MIT-blue)

> Este repositório existe em dois lugares: o **GitLab** é a fonte (aqui entram commits e issues) e o **GitHub** é um
> espelho somente leitura, atualizado sozinho a cada push. Visão geral do conjunto na
> [vitrine fundamentos](https://github.com/danielbmendprofissional/fundamentos).

## Sobre

- **Um repositório só.** O projeto e o conteúdo vivem juntos, e os links entre eles são relativos.
- **Fonte oficial primeiro.** Os padrões vêm do [angular.dev](https://angular.dev), com link; o que é convenção da
  comunidade ou do projeto (como smart / dumb) está dito como tal.
- **Laboratório navegável.** Um menu lateral lista os fundamentos; cada página traz resumo, "o que experimentar",
  fontes oficiais e exemplos para executar.
- **Teoria ligada ao código.** Os comentários `ref:` no código apontam para o arquivo de [conteúdo](0-conteudo/README.md)
  que explica o conceito.

## Projetos

| Projeto | Assunto | Stack | Testes |
|---|---|---|---|
| [1-fundamentos-angular](1-fundamentos-angular/README.md) | Fundamentos do Angular em um laboratório navegável: estado, DI, HTTP, formulários, rotas, UX, i18n | Angular 22, PrimeNG 22, Vitest 5 | 154 |

## Conteúdo

A teoria fica em [0-conteudo](0-conteudo/README.md), organizada por tema:
[Arquitetura](0-conteudo/README.md#arquitetura),
[Estado e DI](0-conteudo/README.md#estado-e-di),
[HTTP e dados](0-conteudo/README.md#http-e-dados),
[Autenticação e rotas](0-conteudo/README.md#autenticação-e-rotas),
[Formulários](0-conteudo/README.md#formulários) e
[UX e plataforma](0-conteudo/README.md#ux-e-plataforma).

## Como rodar

Pré-requisito: **Node.js** (testado com v24.22.1). O Angular CLI vem como dependência do projeto.

```bash
cd 1-fundamentos-angular
npm ci
npm run mock    # backend de mentira em http://localhost:5000 (outro terminal)
npm start       # app em http://localhost:4200
```

Build, lint, testes e a versão em inglês estão no [README do projeto](1-fundamentos-angular/README.md#como-rodar).

## Estrutura

```text
0-conteudo/              # teoria (Markdown), com README próprio
1-fundamentos-angular/   # o projeto Angular, com README
LICENSE
```

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE).
