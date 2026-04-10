# Desafio Tecnico QA - Desbravador (Cypress + BDD)

Projeto de automacao E2E para o fluxo de reservas do portal Desbravador, usando Cypress com Gherkin (BDD), foco em cenarios criticos e evidencias de execucao.

## Visao geral
- Automacao do fluxo de reserva para a unidade `1111`.
- Cobertura de cenarios criticos positivos e negativos.
- Estrutura por camadas: `features`, `steps`, `pages`, `fixtures`, `support`.
- Relatorio consolidado com Mochawesome.

## Stack utilizada
- Node.js (LTS recomendado)
- Cypress
- `@badeball/cypress-cucumber-preprocessor`
- Esbuild preprocessor para features Gherkin
- `cypress-mochawesome-reporter` + `mochawesome`

## Pre-requisitos
- Node.js 20+ (recomendado)
- npm 10+ (ou compatível)
- Google Chrome instalado (para `--browser chrome`)

## Instalacao
```bash
npm install
```

## Execucao dos testes
- Modo interativo:
```bash
npm run cy:open
```

- Modo headless:
```bash
npm run cy:run
```

- Modo headed (janela visivel):
```bash
npm run cy:run:headed
```

- Execucao com limpeza e geracao de relatorio HTML:
```bash
npm run test:report
```

## Estrutura de pastas
```text
.
|-- cypress
|   |-- e2e
|   |   |-- features
|   |   |   `-- reserva-online.feature
|   |   `-- step_definitions
|   |       `-- reserva.steps.js
|   |-- fixtures
|   |   `-- bookingData.json
|   |-- pages
|   |   `-- BookingPage.js
|   |-- support
|   |   |-- commands.js
|   |   `-- e2e.js
|   |-- reports
|   |   `-- html
|   `-- results
|-- docs
|   `-- estrategia-de-testes.md
|-- scripts
|   `-- clean-reports.js
|-- cypress.config.js
|-- cypress.env.example.json
`-- package.json
```

## Cenarios implementados e racional
Detalhamento completo em `docs/estrategia-de-testes.md`.

1. **Reserva completa (positivo, critico, prioridade alta)**  
   Valida o fluxo fim a fim com 2 adultos e 1 crianca.

2. **Quarto STANDARD ST1 indisponivel (negativo, critico, prioridade alta)**  
   Garante feedback claro para indisponibilidade.

3. **Bloqueio sem dados de hospedes (negativo, prioridade alta)**  
   Valida obrigatoriedade de dados essenciais.

4. **Falha de pagamento com cartao invalido (negativo, prioridade media/alta)**  
   Verifica tratamento de erro e mensagem ao usuario.

## Boas praticas aplicadas
- Seletores com fallback (`cy.getByAny`) para reduzir fragilidade.
- Esperas implicitas por estado/elemento (sem `cy.wait` fixo).
- Dados centralizados em fixture (`bookingData.json`).
- Separacao clara entre linguagem de negocio (Gherkin) e implementacao (steps/pages).
- Retentativas no `runMode` para mitigar intermitencia.

## Evidencias e relatorios
- Screenshots de falha: `cypress/screenshots`
- Videos de execucao: `cypress/videos`
- Relatorio final HTML: `cypress/reports/html/index.html`

## Variaveis e dados sensiveis
- Exemplo de configuracao em `cypress.env.example.json`.
- Para personalizar localmente, crie `cypress.env.json` (nao versionado) com os mesmos campos.

## Limitacoes conhecidas do ambiente
- O ambiente pode ficar offline ou sem disponibilidade.
- Nesses casos, registrar evidencia, documentar o comportamento e reexecutar quando houver carga.

## Troubleshooting rapido
- **`Nenhum seletor encontrado` em check-in/check-out:** o portal costuma usar calendario visual + overlay `Aguarde...`, sem `input[name*=checkin]`. O `BookingPage` agora espera o overlay sumir, aceita etapa de hospedes com legenda de disponibilidade e tenta fluxo flatpickr quando aplicavel. Se ainda falhar, use o botao **DOM Snapshot** no Cypress e ajuste seletores em `BookingPage.js`.
- **Erro de timeout na busca de disponibilidade:** aumentar janela de datas ou reexecutar por indisponibilidade do ambiente.
- **Seletores nao encontrados:** revisar mudancas de UI e ajustar fallback no `BookingPage.js`.
- **Relatorio nao gerado:** executar `npm run report:clean` e depois `npm run test:report`.

## Sugestao de submissao
- Publicar o repositorio no GitHub (publico).
- Anexar ou compartilhar o relatorio HTML e evidencias.
- Informar no e-mail que o ambiente pode ter indisponibilidade eventual.
"# desbravador" 
