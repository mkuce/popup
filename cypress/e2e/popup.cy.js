import { popupMessage } from "../../popup.constants";

describe("Popup", () => {
  it("should be shown with correct text, when page is loaded for first time", () => {
    cy.visit("/");
    cy.get("#popup")
      .should("be.visible")
      .find("h2")
      .should("have.text", 'Please confirm that you read this.')
      .should("be.visible");
  });

  it("should close once clicked on close button", () => {
    cy.visit("/");
    cy.get("#close-button").should("be.visible").click();
    cy.get("#popup").should("not.be.visible");
  });

  it("should close once clicked outside the popup", () => {
    cy.visit("/");
    cy.get("body").click();
    cy.get("#popup").should("not.be.visible");
  });

  it("should be not shown when page is reloaded after confirmation", () => {
    cy.visit("/");
    cy.get("#popup").find("button").should("have.text", "confirm").click();
    cy.get("#popup").should("not.be.visible");

    cy.reload();

    cy.get("#popup").should("not.be.visible");
  });

  it("should be not shown when page is loaded but it was already confirmed in past 10 minutes", () => {
    cy.setCookie("confirmed", "true");
    cy.visit("/");
    cy.get("#popup").should("not.be.visible");
  });
});

describe("Endpoint", () => {
  it("GET /popup returns correct message and displays it in the popup with 200 OK status", () => {
    cy.intercept("GET", "/popup").as("getPopup");

    cy.visit("/")
      .wait("@getPopup")
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
        expect(res.response.body.message).to.contain(popupMessage);
      });

    cy.get("#popup")
      .should("be.visible")
      .within(() => {
        cy.get("#popup-message")
          .should("have.text", popupMessage)
          .should("be.visible");
      });
  });

  it("GET /popup returns a non-200 status and popup is not shown", () => {
    cy.intercept("GET", "/popup", {
      statusCode: 500,
    }).as("getPopup");

    cy.visit("/").wait("@getPopup");

    cy.get("#popup").should("not.be.visible");
  });

  it("POST /popup/confirmation returns status 200 and popup is not shown again when page is refreshed", () => {
    cy.intercept("GET", "/popup", {
      statusCode: 200,
      body: {
        message: `<p>${popupMessage}</p>`,
      },
    }).as("getPopup");

    cy.intercept("POST", "/popup/confirmation").as("popupConfirmation");

    cy.visit("/").wait("@getPopup");

    cy.get("#popup")
      .find("button")
      .click()
      .wait("@popupConfirmation")
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
        expect(res.response.body.confirmationTracked).to.be.true
      });

    cy.reload();

    cy.get("#popup").should("not.be.visible");
  });

  it("POST /popup/confirmation returns a non-200 status and popup is shown again after refresh", () => {
    cy.intercept("GET", "/popup", {
      statusCode: 200,
      body: {
        message: `<p>${popupMessage}</p>`,
      },
    }).as("getPopup");

    cy.intercept("POST", "/popup/confirmation", {
      statusCode: 500,
    }).as("popupConfirmation");

    cy.visit("/").wait("@getPopup");

    cy.get("#popup").find("button").click().wait("@popupConfirmation");

    cy.reload();

    cy.get("#popup").should("be.visible");
  });
});
