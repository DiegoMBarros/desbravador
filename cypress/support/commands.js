function firstExistingSelector(selectors, options = {}) {
  const timeout = options.timeout || 10000;

  return cy.document().then((doc) => {
    const found = selectors.find((selector) => {
      if (selector.startsWith("text=")) {
        const text = selector.replace("text=", "");
        return doc.body.innerText.toLowerCase().includes(text.toLowerCase());
      }
      return doc.querySelector(selector);
    });
    if (!found) {
      throw new Error(`Nenhum seletor encontrado: ${selectors.join(", ")}`);
    }
    if (found.startsWith("text=")) {
      return cy.contains(new RegExp(found.replace("text=", ""), "i"), { timeout });
    }
    return cy.get(found, { timeout });
  });
}

Cypress.Commands.add("getByAny", (selectors, options = {}) => {
  return firstExistingSelector(selectors, options);
});

Cypress.Commands.add("safeType", (selectors, value, options = {}) => {
  return cy.getByAny(selectors, options).clear().type(value, options);
});

Cypress.Commands.add("safeClick", (selectors, options = {}) => {
  return cy
    .getByAny(selectors, options)
    .scrollIntoView()
    .should("be.visible")
    .click({ force: true, ...options });
});
