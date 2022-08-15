describe('Demo sites for tracking scripts', () => {
  it('should display correct heading', () => {
    cy.visit('http://localhost:4000')
    cy.get("h1").should("exist")
  })
})