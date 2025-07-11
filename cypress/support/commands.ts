/// <reference types="cypress" />

Cypress.Commands.add('addIngredient', (id: string) => {
  cy.get(`[data-testid="ingredient-${id}"]`).find("button").click({ force: true });
});

Cypress.Commands.add('openIngredientModal', (id: string) => {
  cy.get(`[data-testid="ingredient-${id}"]`).scrollIntoView().click();
  cy.get('[data-testid="modal"]').should('be.visible');
});

Cypress.Commands.add('closeModalByButton', () => {
  cy.get('[data-testid="modal-close"]').click();
  cy.get('[data-testid="modal"]').should('not.exist');
});

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('[data-testid="modal-overlay"]').click("topLeft", { force: true });
  cy.get('[data-testid="modal"]').should('not.exist');
});

declare global {
  namespace Cypress {
    interface Chainable {
      addIngredient(id: string): Chainable<void>;
      openIngredientModal(id: string): Chainable<void>;
      closeModalByButton(): Chainable<void>;
      closeModalByOverlay(): Chainable<void>;
    }
  }
}

export {};
