class searchPage {
    searchResult = () => cy.get('.card-title a')}

module.exports = new searchPage

// searchResult = () => cy.get('app-book-card').within(() => {
//     cy.get('.card-title a strong')
// })