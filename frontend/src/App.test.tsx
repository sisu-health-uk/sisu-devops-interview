export {};
describe('App', () => {
  it('renders learn react link', () => {
    cy.visit('/');
    cy.get('.App-link').should('contain', 'Learn React');
  });

  it('renders logo', () => {
    cy.visit('/');
    cy.get('.App-logo').should('be.visible');
  });
});
