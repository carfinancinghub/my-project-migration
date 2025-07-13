describe('Collaboration Chat', () => {
  it('should login and navigate to chat', () => {
    cy.login('test@example.com', 'password');
    cy.visit('/chat');
  });
});
