class homePage {
    login = () => cy.get('.mat-button-wrapper').contains('Login');
    userNameHeader = () => cy.get('.mat-button-wrapper');
    userMenu = () => cy.get('.mat-menu-panel');
    logout = () => cy.get('.mat-menu-item').contains('Logout');
    searchBox = () => cy.get('input[type="search"]');
    optionText = () => cy.get('mat-option[role="option"]');
    categoryList = () => cy.get('.mat-list-base');
    categoryOption = () => cy.get('.mat-list-item');
    slider = () => cy.get('mat-slider[role="slider"]');
    priceLabel = () => cy.get('.p-2 div');
    bookCardPrice = () => cy.get('app-book-card .mat-card-content p');
    addToCartPopup = () => cy.contains('One Item added to cart');
    shoppingCartIcon = () => cy.get('mat-icon');
    favoriteIcon = () => cy.get('.mat-button-wrapper').contains('favorite')
}

module.exports = new homePage