# Estrategia de Testes - Desafio QA Desbravador

## Objetivo
Validar o fluxo critico de reserva online com foco em:
- disponibilidade de diaria minima;
- escolha de quarto especifico (STANDARD ST1);
- composicao de hospedes;
- preenchimento de dados obrigatorios;
- tentativa de pagamento.

## Escopo
- URL testada: `https://reservas.desbravador.com.br/1111`
- Cobertura: testes E2E em Cypress com BDD (Gherkin).
- Tipo de dados: dados sinteticos e cartoes de teste.

## Riscos Principais
- Instabilidade do ambiente (offline, sem carga de inventario, timeout de pagina).
- Alteracao de identificadores de elementos na UI.
- Fluxo de pagamento depender de terceiros e bloquear conclusao no ambiente de teste.

## Cenarios selecionados e racional

### Cenario 1 - Reserva completa com sucesso ou processamento
- **Prioridade:** Alta
- **Objetivo:** Garantir que o fluxo principal funciona de ponta a ponta.
- **Risco coberto:** Regressao no caminho feliz, principal jornada de negocio.
- **Por que foi escolhido:** Este cenario representa o valor central do produto: converter uma reserva.

### Cenario 2 - Quarto STANDARD ST1 indisponivel
- **Prioridade:** Alta
- **Objetivo:** Garantir feedback claro quando inventario nao estiver disponivel.
- **Risco coberto:** Falha silenciosa para indisponibilidade, frustrando a pessoa usuaria.
- **Por que foi escolhido:** O desafio menciona explicitamente o quarto STANDARD ST1, que pode nao existir em todos os dias.

### Cenario 3 - Validacao de hospedes obrigatorios
- **Prioridade:** Alta
- **Objetivo:** Confirmar bloqueio de avancar sem dados essenciais.
- **Risco coberto:** Dados incompletos no pedido, falhas de compliance e atendimento.
- **Por que foi escolhido:** Campos obrigatorios sao criticos para emissao e contato.

### Cenario 4 - Pagamento invalido
- **Prioridade:** Media/Alta
- **Objetivo:** Validar tratamento de erro no pagamento.
- **Risco coberto:** Usuario sem feedback quando transacao e recusada.
- **Por que foi escolhido:** Falhas de pagamento sao comuns e precisam de mensagem clara.

## Evidencias e Relatorios
- Screenshot automatica em falha (`cypress/screenshots`).
- Video de execucao habilitado (`cypress/videos`).
- Relatorio consolidado Mochawesome em:
  - JSON: `cypress/results/mochawesome.json`
  - HTML: `cypress/reports/html/index.html`

## Limites conhecidos
- O ambiente pode ficar sem disponibilidade ou offline.
- Em caso de indisponibilidade sistêmica, registrar evidencia e reexecutar quando houver carga.
