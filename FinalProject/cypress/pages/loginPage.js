class loginPage {
    registerButton = () => cy.get('.mat-button-wrapper').contains('Register');
    login = () => cy.get ('.mat-card-actions button .mat-button-wrapper' ).contains('Login');
    userName = () => cy.get('input[formcontrolname="username"]');
    password = () => cy.get('input[formcontrolname="password"]');
    labels = () => cy.get('.mat-form-field-label');
    underline = () => cy.get('.mat-form-field-ripple');
}

module.exports = new loginPage