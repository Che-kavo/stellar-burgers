/// <reference types="cypress" />

import '../support/commands';

describe("Тесты конструктора", () => {
  const BUN_ID = "643d69a5c3f7b9001cfa093c";
  const FILLING_ID = "643d69a5c3f7b9001cfa0941";

  const SELECTORS = {
    topBun: '[data-testid="top-bun"]',
    bottomBun: '[data-testid="bottom-bun"]',
    listFilling: '[data-testid="list-filling"]',
    modal: '[data-testid="modal"]',
    modalCloseBtn: '[data-testid="modal-close"]',
    modalOverlay: '[data-testid="modal-overlay"]',
    orderNumber: '[data-testid="orderNumber"]',
    checkoutBtn: '[data-testid="checkout"]',
    priceConstructor: '[data-testid="price-constructor"]'
  };

  const API_INGREDIENTS = "**/ingredients";
  const API_AUTH_USER = "**/auth/user";
  const API_ORDERS = "**/orders";

  const mockOrderResponse = {
    success: true,
    name: "Краторный флюоробургер",
    order: {
      _id: "65ff9fa9abdee0001ceec111",
      status: "done",
      name: "Краторный флюоробургер",
      createdAt: "2025-07-03T10:30:00.000Z",
      updatedAt: "2025-07-03T10:30:10.000Z",
      number: 38483,
      ingredients: [BUN_ID, FILLING_ID, "643d69a5c3f7b9001cfa0945", BUN_ID],
    }
  };

  const mockUserResponse = {
    success: true,
    user: {
      email: "test@example.com",
      name: "Test User"
    }
  };

  beforeEach(() => {
    cy.intercept("GET", API_INGREDIENTS, { fixture: "ingredients.json" }).as("getIngredients");
    cy.intercept("GET", API_AUTH_USER, { statusCode: 200, body: mockUserResponse }).as("getUser");
    cy.intercept("POST", API_ORDERS, { statusCode: 200, body: mockOrderResponse }).as("postOrder");

    cy.setCookie("accessToken", "Bearer mock-access-token");
    window.localStorage.setItem("refreshToken", "mock-refresh-token");

    cy.visit("/");
    cy.viewport(1440, 800);
    cy.wait("@getIngredients");
    cy.wait("@getUser");
  });

  it("Добавление булки и начинки в конструктор", () => {
    cy.addIngredient(BUN_ID);

    cy.get(SELECTORS.topBun).as("topBun");
    cy.get(SELECTORS.bottomBun).as("bottomBun");

    cy.get("@topBun").should("contain.text", "Краторная булка N-200i");
    cy.get("@bottomBun").should("contain.text", "Краторная булка N-200i");

    cy.addIngredient(FILLING_ID);

    cy.get(SELECTORS.listFilling).children().should("have.length.at.least", 1);
  });

  describe("Модальное окно ингредиента", () => {
    beforeEach(() => {
      cy.openIngredientModal(FILLING_ID);
      cy.get(SELECTORS.modal).as("modal");
    });

    it("закрывается по кнопке-крестику", () => {
      cy.get("@modal").should("be.visible");
      cy.closeModalByButton();
      cy.get("@modal").should("not.exist");
    });

    it("закрывается по клику на оверлей", () => {
      cy.get("@modal").should("be.visible");
      cy.closeModalByOverlay();
      cy.get("@modal").should("not.exist");
    });
  });

  it("Оформление заказа: создаётся заказ, открывается модалка с номером, конструктор очищается", () => {
    cy.addIngredient(BUN_ID);
    cy.addIngredient(FILLING_ID);

    cy.get(SELECTORS.checkoutBtn).click({ force: true });
    cy.wait("@postOrder").its("response.statusCode").should("eq", 200);

    cy.get(SELECTORS.modal, { timeout: 10000 }).should("be.visible");
    cy.get(SELECTORS.orderNumber).should("contain.text", mockOrderResponse.order.number.toString());

    cy.closeModalByButton();

    cy.get(SELECTORS.topBun).should("not.exist");
    cy.get(SELECTORS.bottomBun).should("not.exist");

    cy.get(SELECTORS.listFilling).then($el => {
      if ($el.children().length === 1) {
        cy.wrap($el).contains('Выберите начинку').should('exist');
      } else {
        cy.wrap($el).children().should('have.length', 0);
      }
    });

    cy.get(SELECTORS.priceConstructor).should("contain.text", "0");
  });
});
