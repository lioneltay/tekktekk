describe("Intialization", function() {
  it("Initialize the anonymous user and create first 'Todo' list", () => {
    cy.visit("/")

    cy.findByText(/todo/i)
  })

  it("Clicking menu opens drawer", () => {
    cy.visit("/")

    cy.findByTestId("menu-button").click()

    cy.findByText(/primary list/i)

    cy.findByTestId("close-drawer-button").click()

    cy.findByText(/primary list/i)

    cy.findByTestId("close-drawer-button").should("not.exist")
  })
})