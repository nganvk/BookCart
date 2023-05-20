class shoppingCartPage {
    clearCartButton = () => cy.contains('Clear cart');
    cartItemHeader = () => cy.get('tr').eq(0).find('th');
    cartItemBody = () => cy.get('tr').eq(1).find('td');
    cartItemFooter = () => cy.get('tr').eq(2);
    checkOutButton = () => cy.contains('CheckOut');
    clearCartPopup = () => cy.contains('Cart cleared!!!');
    emptyShoppingCart = () => cy.contains('Shopping cart is empty');
    continueShoppingButton = () => cy.contains('Continue shopping');
    minusButton = () => cy.get('.btn-minus');
    plusButton = () => cy.get('.btn-plus');
}

module.exports = new shoppingCartPage