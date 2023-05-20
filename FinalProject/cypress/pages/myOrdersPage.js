class myOrdersPage {
    myOrderHeader = () => cy.get('th');
    orderID = () => cy.get('td.mat-column-orderId');
    orderOn = () => cy.get('td.mat-column-orderedOn');
    orderTotal = () => cy.get('td.mat-column-orderTotal')
}

module.exports = new myOrdersPage