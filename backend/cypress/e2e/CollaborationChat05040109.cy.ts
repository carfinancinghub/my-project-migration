describe('Collaboration Chat 05040109', () => {
  it('should login and navigate to chat', () => {
    cy.login('test@example.com', 'password');
    cy.visit('/chat');
  });
});
