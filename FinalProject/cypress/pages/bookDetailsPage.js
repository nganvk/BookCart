class bookDetailsPage {
    addToCartButton = () => cy.get('.mat-button-wrapper').contains(' Add to Cart');
    getSimilarBooks = () => cy.get('.card-deck-container').children();
    bookPreviewImage = () => cy.get('.image-card').eq(0).find('img');
    bookInfo = () => cy.get('.table tr')
}

module.exports = new bookDetailsPage