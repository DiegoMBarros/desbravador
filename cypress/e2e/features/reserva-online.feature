# language: pt
Funcionalidade: Reserva online no portal Desbravador
  Como pessoa usuaria do portal de reservas
  Quero verificar disponibilidade e concluir reserva
  Para garantir hospedagem com pagamento online

  Contexto:
    Dado que acesso o portal de reservas da unidade 1111

  @critico @positivo @reserva-completa
  Cenario: Concluir reserva para 2 adultos e 1 crianca por 3 noites
    Quando consulto disponibilidade para no minimo 3 dias
    E seleciono o quarto "STANDARD ST1"
    E configuro a reserva para 2 adultos e 1 crianca de ate 5 anos
    E preencho os dados dos hospedes
    E realizo pagamento com cartao de credito valido
    Entao devo visualizar indicacao de reserva concluida ou em processamento

  @critico @negativo @quarto-indisponivel
  Cenario: Exibir feedback quando o quarto STANDARD ST1 estiver indisponivel
    Quando consulto disponibilidade para no minimo 3 dias
    Entao devo ter disponibilidade para selecionar "STANDARD ST1" ou receber aviso de indisponibilidade

  @alto @negativo @validacao-hospedes
  Cenario: Bloquear avancar sem preencher dados obrigatorios de hospedes
    Quando consulto disponibilidade para no minimo 3 dias
    E seleciono o quarto "STANDARD ST1"
    E configuro a reserva para 2 adultos e 1 crianca de ate 5 anos
    E tento avancar sem preencher os dados dos hospedes
    Entao devo ver mensagens de validacao dos campos obrigatorios de hospedes

  @alto @negativo @pagamento-invalido
  Cenario: Exibir erro ao tentar pagar com cartao invalido
    Quando consulto disponibilidade para no minimo 3 dias
    E seleciono o quarto "STANDARD ST1"
    E configuro a reserva para 2 adultos e 1 crianca de ate 5 anos
    E preencho os dados dos hospedes
    E realizo pagamento com cartao de credito invalido
    Entao devo visualizar mensagem de falha no pagamento
