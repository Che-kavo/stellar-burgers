/// <reference types="cypress" />

describe("Тесты конструктора", () => {
  const BASE_URL = "http://localhost:4000/";
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
      ingredients: [
        "643d69a5c3f7b9001cfa093c",
        "643d69a5c3f7b9001cfa0941",
        "643d69a5c3f7b9001cfa0945",
        "643d69a5c3f7b9001cfa093c"
      ]
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

    cy.intercept("GET", API_AUTH_USER, {
      statusCode: 200,
      body: mockUserResponse
    }).as("getUser");

    cy.intercept("POST", API_ORDERS, {
      statusCode: 200,
      body: mockOrderResponse
    }).as("postOrder");

    cy.setCookie("accessToken", "Bearer mock-access-token");
    window.localStorage.setItem("refreshToken", "mock-refresh-token");

    cy.visit(BASE_URL);
    cy.viewport(1440, 800);
    cy.wait("@getIngredients");
    cy.wait("@getUser");
  });

  it("Добавление булки и начинки в конструктор", () => {
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]').find("button").click({ force: true });
    cy.get('[data-testid="top-bun"]').should("contain.text", "Краторная булка N-200i");
    cy.get('[data-testid="bottom-bun"]').should("contain.text", "Краторная булка N-200i");

    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]').find("button").click({ force: true });
    cy.get('[data-testid="list-filling"]').children().should("have.length.at.least", 1);
  });

  describe("Модальное окно ингредиента", () => {
    beforeEach(() => {
      cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]').scrollIntoView().click();
      cy.get('[data-testid="modal"]').should("be.visible");
    });

    it("закрывается по кнопке-крестику", () => {
      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="modal"]').should("not.exist");
    });

    it("закрывается по клику на оверлей", () => {
      cy.get('[data-testid="modal-overlay"]').click("topLeft", { force: true });
      cy.get('[data-testid="modal"]').should("not.exist");
    });
  });

  it("Оформление заказа: создаётся заказ, открывается модалка с номером, конструктор очищается", () => {
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]').find("button").click({ force: true });
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]').find("button").click({ force: true });

    cy.get('[data-testid="checkout"]').click({ force: true });

    cy.wait("@postOrder").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="modal"]', { timeout: 10000 }).should("be.visible");
    cy.get('[data-testid="orderNumber"]').should("contain.text", mockOrderResponse.order.number.toString());

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should("not.exist");

    cy.get('[data-testid="top-bun"]').should("not.exist");
    cy.get('[data-testid="bottom-bun"]').should("not.exist");

    cy.get('[data-testid="list-filling"]').then($el => {
      if ($el.children().length === 1) {
        cy.wrap($el).contains('Выберите начинку').should('exist');
      } else {
        cy.wrap($el).children().should('have.length', 0);
      }
    });

    cy.get('[data-testid="price-constructor"]').should("contain.text", "0");
  });
});
