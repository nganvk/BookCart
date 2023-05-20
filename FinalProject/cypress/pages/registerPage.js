class registerPage {
    firstName = () => cy.get('input[formcontrolname="firstname"]');
    lastName = () => cy.get('input[formcontrolname="lastname"]');
    userName = () => cy.get('input[formcontrolname="username"]');
    password = () => cy.get('input[formcontrolname="password"]');
    confirmPassword = () => cy.get('input[formcontrolname="confirmPassword"]');
    registerButton = () => cy.get('.mat-button-wrapper').contains('Register');
    gender = () => cy.get('mat-radio-group[formcontrolname="gender"]');
    formLabels = () => cy.get('.mat-form-field-label');
    formRipple = () => cy.get('.mat-form-field-ripple');
    passwordError = () => cy.get('.mat-error').contains('Password should have minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number')
    confirmPasswordError = () => cy.get('.mat-error').contains('Password do not match')
}

module.exports = new registerPage