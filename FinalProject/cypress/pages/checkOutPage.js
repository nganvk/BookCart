class checkOutPage {
    header = () => cy.get('h2');
    cardTitle = () => cy.get('.mat-card-title');
    placeOrderButton = () => cy.get('button[type="submit"]').contains('Place Order');
    cancelButton = () => cy.get('button[type="button"]').contains('CANCEL');
    orderSummaryHeader = () => cy.get('tr').eq(0).find('th');
    orderSummaryBody = () => cy.get('tr').eq(1).find('td');
    orderSummaryFooter = () => cy.get('tr').eq(2);
    name = () => cy.get('input[formcontrolname="name"]');
    addressLine1 = () => cy.get('input[formcontrolname="addressLine1"]');
    addressLine2 = () => cy.get('input[formcontrolname="addressLine2"]');
    pinCode = () => cy.get ('input[formcontrolname="pincode"]');
    state = () => cy.get('input[formcontrolname="state"]');
    orderSuccessPopup = () => cy.contains('Order placed successfully!!!');
    formLabel = () => cy.get('.mat-form-field-label');
    formRipple = () => cy.get('.mat-form-field-ripple')
}

module.exports = new checkOutPage