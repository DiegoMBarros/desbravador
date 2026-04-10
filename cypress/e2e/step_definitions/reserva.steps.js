const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");
const bookingPage = require("../../pages/BookingPage");

let bookingData;

Given("que acesso o portal de reservas da unidade 1111", () => {
  cy.fixture("bookingData").then((data) => {
    bookingData = data;
  });
  bookingPage.visit();
  cy.url().should("include", "/1111");
});

When("consulto disponibilidade para no minimo {int} dias", (nights) => {
  bookingPage.searchAvailabilityByNights(nights);
});

When("seleciono o quarto {string}", (roomType) => {
  bookingPage.selectRoom(roomType);
});

When(
  "configuro a reserva para {int} adultos e {int} crianca de ate {int} anos",
  (adults, children, age) => {
    bookingPage.configureGuests(adults, children, age);
  }
);

When("preencho os dados dos hospedes", () => {
  bookingPage.fillGuestData(bookingData.guest, bookingData.address);
});

When("realizo pagamento com cartao de credito valido", () => {
  bookingPage.fillCardAndPay(bookingData.payment.validCard);
});

When("realizo pagamento com cartao de credito invalido", () => {
  bookingPage.fillCardAndPay(bookingData.payment.invalidCard);
});

When("tento avancar sem preencher os dados dos hospedes", () => {
  bookingPage.submitWithoutGuestData();
});

Then(
  "devo ter disponibilidade para selecionar {string} ou receber aviso de indisponibilidade",
  (roomType) => {
    bookingPage.assertRoomAvailableOrWarning(roomType);
  }
);

Then("devo ver mensagens de validacao dos campos obrigatorios de hospedes", () => {
  bookingPage.assertGuestValidationErrors();
});

Then("devo visualizar mensagem de falha no pagamento", () => {
  bookingPage.assertPaymentFailure();
});

Then("devo visualizar indicacao de reserva concluida ou em processamento", () => {
  bookingPage.assertBookingFinishedOrProcessing();
});
