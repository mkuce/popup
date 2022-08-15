describe('Popup', () => {

    const pageUrl = `http://localhost:4000/`

    it('should be shown when page is loaded for first time', async () => {
        /* please implement test here */
        cy.visit(pageUrl);

        cy.get('#popup').should("exist");
    });

    it('should close once clicked on close button', async () => {
        /* please implement test here */
        cy.visit(pageUrl);

        cy.get('#popup').should("exist");
    });

    it('should close once clicked outside the popup', async () => {
       /* please implement test here */
       cy.visit(pageUrl);

       cy.get('#popup').should("exist");
    });


    it('should be not shown when page is reloaded after confirmation', async () => {
        /* please implement test here */
        cy.visit(pageUrl);

        cy.get('#popup').should("exist");
    });

    it('should be not shown when page is loaded but it was already confirmed in past 10 minutes', async () => {
        /* please implement test here */
        cy.visit(pageUrl);

        cy.get('#popup').should("exist");
    });

    /* please implement any additional scenario you consider as needed to ensure good test coverage */
});

