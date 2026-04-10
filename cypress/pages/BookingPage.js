const CHECKIN_SELECTORS = [
  '[data-testid="checkin"]',
  'input[name*="checkin" i]',
  'input[id*="checkin" i]',
  'input[id*="entrada" i]',
  'input[placeholder*="Check-in"]',
  'input[placeholder*="Entrada"]',
  'input[placeholder*="Chegada"]',
  'input[placeholder*="Data de entrada" i]',
  'input[aria-label*="entrada" i]',
  'input[aria-label*="check-in" i]',
];

const CHECKOUT_SELECTORS = [
  '[data-testid="checkout"]',
  'input[name*="checkout" i]',
  'input[id*="checkout" i]',
  'input[id*="saida" i]',
  'input[placeholder*="Check-out"]',
  'input[placeholder*="Saida"]',
  'input[placeholder*="Saída"]',
  'input[placeholder*="Data de saida" i]',
  'input[aria-label*="saida" i]',
  'input[aria-label*="check-out" i]',
];

const SEARCH_SELECTORS = [
  '[data-testid="search-availability"]',
  'button[type="submit"]',
  "text=Buscar",
  "text=Pesquisar",
];

class BookingPage {
  visit() {
    cy.visit("/");
  }

  /**
   * Aguarda o modal/spinner "Aguarde..." sair da tela antes de interagir.
   * Procura apenas em tags curtas (div/span/p) para nao varrer o DOM inteiro.
   */
  waitUntilLoaderGone() {
    cy.get("body", { timeout: 45000 }).should(($body) => {
      const blocking = $body
        .find("div, span, p, strong, h1, h2")
        .filter((_, el) => {
          if (!Cypress.dom.isVisible(el)) return false;
          const t = (el.textContent || "").trim();
          return /^aguarde\.?\.?\.?$/i.test(t);
        });
      expect(
        blocking.length,
        "overlay de carregamento (Aguarde...) deve sumir"
      ).to.eq(0);
    });
  }

  /**
   * Selecao por calendario estilo flatpickr (comum em motores de reserva).
   */
  pickFlatpickrRange(minNights = 3) {
    cy.get(
      "input.flatpickr-input, input.flatpickr-alt-input",
      { timeout: 15000 }
    )
      .first()
      .click({ force: true });
    cy.get(".flatpickr-calendar", { timeout: 15000 }).should("be.visible");
    cy.get(
      ".flatpickr-day:not(.flatpickr-disabled):not(.prevMonthDay):not(.nextMonthDay)"
    ).then(($days) => {
      expect($days.length, "dias clicaveis no calendario").to.be.greaterThan(
        minNights + 1
      );
      cy.wrap($days.eq(0)).click({ force: true });
      cy.wrap($days.eq(minNights)).click({ force: true });
    });
    cy.get("body").click(0, 0, { force: true });
  }

  searchAvailabilityByNights(nights = 3) {
    cy.contains(/reservas online|defina a quantidade|dispon[ií]vel|h[oó]spedes/i, {
      timeout: 45000,
    }).should("be.visible");

    this.waitUntilLoaderGone();

    cy.get("body", { timeout: 30000 }).should(($body) => {
      expect($body.text().length).to.be.greaterThan(50);
    });

    cy.document().then((doc) => {
      const inputs = [...doc.querySelectorAll('input:not([type="hidden"])')];
      const hasTypedDateFields = inputs.some((el) => {
        if (el.disabled || el.readOnly) return false;
        const blob = `${el.name} ${el.id} ${el.placeholder || ""} ${
          el.getAttribute("aria-label") || ""
        }`.toLowerCase();
        return /checkin|checkout|entrada|sa[ií]da|chegada|data/.test(blob);
      });

      const t = doc.body.innerText || "";
      const guestStep =
        /defina a quantidade de h[oó]spedes/i.test(t) ||
        /continuar reserva/i.test(t);

      if (hasTypedDateFields) {
        const today = new Date();
        const checkin = new Date(today);
        checkin.setDate(today.getDate() + 7);
        const checkout = new Date(checkin);
        checkout.setDate(checkin.getDate() + nights);

        const format = (date) =>
          `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
          ).padStart(2, "0")}/${date.getFullYear()}`;

        cy.safeType(CHECKIN_SELECTORS, format(checkin));
        cy.safeType(CHECKOUT_SELECTORS, format(checkout));
        cy.safeClick(SEARCH_SELECTORS);
      } else if (guestStep) {
        cy.log(
          "Etapa de hospedes visivel sem inputs de data editaveis; validando disponibilidade pela legenda/calendario na tela."
        );
        cy.contains(/dispon[ií]vel|indispon[ií]vel|selecionado|pacotes/i, {
          timeout: 20000,
        }).should("be.visible");
      } else {
        this.pickFlatpickrRange(nights);
      }
    });

    this.waitUntilLoaderGone();
    cy.contains(
      /(resultado|quarto|disponib|defina a quantidade|continuar reserva|standard)/i,
      { timeout: 45000 }
    ).should("be.visible");
  }

  selectRoom(roomType) {
    cy.contains(roomType, { timeout: 15000 }).should("be.visible");
    cy.contains(roomType)
      .parentsUntil("body")
      .parent()
      .within(() => {
        cy.contains(/(selecionar|reservar|escolher)/i).click({ force: true });
      });
  }

  configureGuests(adults, children, age) {
    cy.safeClick([
      '[data-testid="guests-toggle"]',
      "text=Hospedes",
      "text=Pessoas",
    ]);

    this.setCounterValue(/adult/i, adults);
    this.setCounterValue(/crian/i, children);

    if (children > 0) {
      cy.get("select, input").then(($fields) => {
        const ageField = [...$fields].find((el) =>
          /idade|age/i.test(el.name || el.id || el.placeholder || "")
        );
        if (ageField) {
          cy.wrap(ageField).clear().type(String(age));
        }
      });
    }
  }

  setCounterValue(labelRegex, target) {
    cy.contains(labelRegex)
      .parents()
      .filter(":visible")
      .first()
      .within(() => {
        cy.get("select, input").first().then(($field) => {
          if ($field.is("select")) {
            cy.wrap($field).select(String(target), { force: true });
            return;
          }
          cy.wrap($field).clear().type(String(target), { force: true });
        });
      });
  }

  fillGuestData(guest, address) {
    cy.safeType(['input[name*="firstName"]', 'input[name*="nome"]'], guest.firstName);
    cy.safeType(['input[name*="lastName"]', 'input[name*="sobrenome"]'], guest.lastName);
    cy.safeType(['input[type="email"]', 'input[name*="email"]'], guest.email);
    cy.safeType(['input[name*="phone"]', 'input[name*="telefone"]'], guest.phone);
    cy.safeType(['input[name*="document"]', 'input[name*="cpf"]'], guest.document);
    cy.safeType(['input[name*="zip"]', 'input[name*="cep"]'], address.zipCode);
    cy.safeType(['input[name*="number"]', 'input[name*="numero"]'], address.streetNumber);
    cy.safeType(['input[name*="complement"]', 'input[name*="complemento"]'], address.complement);
  }

  submitWithoutGuestData() {
    cy.safeClick([
      '[data-testid="continue-booking"]',
      "text=Continuar Reserva",
      "text=Continuar",
      "text=Avancar",
      "text=Prosseguir",
    ]);
  }

  fillCardAndPay(card) {
    cy.safeType(['input[name*="cardNumber"]', 'input[placeholder*="Numero do cartao"]'], card.number);
    cy.safeType(['input[name*="cardName"]', 'input[placeholder*="Nome impresso"]'], card.name);
    cy.safeType(['input[name*="expiry"]', 'input[placeholder*="MM/AA"]'], card.expiry);
    cy.safeType(['input[name*="cvc"]', 'input[name*="cvv"]'], card.cvc);
    cy.safeClick([
      '[data-testid="finish-booking"]',
      "text=Finalizar",
      "text=Pagar",
      "text=Concluir",
    ]);
  }

  assertRoomAvailableOrWarning(roomType) {
    cy.contains("body", roomType, { timeout: 15000 }).then(($body) => {
      if ($body.text().includes(roomType)) {
        cy.contains(roomType).should("be.visible");
      } else {
        cy.contains(/(indisponivel|sem disponibilidade|nao ha quartos)/i).should(
          "be.visible"
        );
      }
    });
  }

  assertGuestValidationErrors() {
    cy.contains(/(obrigatorio|preencha|invalido|required)/i).should("be.visible");
  }

  assertPaymentFailure() {
    cy.contains(/(falha|recusado|nao autorizado|erro no pagamento)/i, {
      timeout: 20000,
    }).should("be.visible");
  }

  assertBookingFinishedOrProcessing() {
    cy.contains(/(confirmada|sucesso|processamento|pedido recebido)/i, {
      timeout: 25000,
    }).should("be.visible");
  }
}

module.exports = new BookingPage();
