// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import bookDetailsPage from "../pages/bookDetailsPage"
import checkOutPage from "../pages/checkOutPage"
import homePage from "../pages/homePage"
import loginPage from "../pages/loginPage"
import registerPage from "../pages/registerPage"
import shoppingCartPage from "../pages/shoppingCartPage"
import myOrdersPage from "../pages/myOrdersPage"


Cypress.Commands.add('navigateToLoginPage', () => {
    homePage.login().click()
    cy.url().should('include', '/login');
})

Cypress.Commands.add('navigateToRegisterPage', () => {
    loginPage.registerButton().click();
    cy.url().should('include', '/register');
})

Cypress.Commands.add('verifyRegisterPageElements', () => {
    registerPage.firstName().should('have.attr', 'data-placeholder', 'First name');
    registerPage.lastName().should('have.attr', 'data-placeholder', 'Last Name');
    registerPage.userName().should('have.attr', 'data-placeholder', 'User Name');
    registerPage.password().should('have.attr', 'data-placeholder', 'Password');
    registerPage.confirmPassword().should('have.attr', 'data-placeholder', 'Confirm Password');
    registerPage.gender().should('be.visible')
    registerPage.registerButton().should('be.visible');
})

Cypress.Commands.add('registerUser', (data) => {
    registerPage.firstName().type(data.firstName);
    registerPage.lastName().type(data.lastName);
    registerPage.userName().type(data.userName);
    registerPage.password().type(data.password);
    registerPage.confirmPassword().type(data.confirmPassword); 
    registerPage.gender().contains(data.gender).click();
})

Cypress.Commands.add('registerUserwithInvalidPassword', (invalidData) => {
    registerPage.firstName().type(invalidData.firstName);
    registerPage.lastName().type(invalidData.lastName);
    registerPage.userName().type(invalidData.userName);
    registerPage.password().type(invalidData.invalidPassword);
    registerPage.confirmPassword().type(invalidData.confirmPassword); 
    registerPage.gender().contains(invalidData.gender).click();
})

Cypress.Commands.add('registerUserwithInvalidConfirmPassword', (invalidData) => {
    registerPage.firstName().type(invalidData.firstName);
    registerPage.lastName().type(invalidData.lastName);
    registerPage.userName().type(invalidData.userName);
    registerPage.password().type(invalidData.validPassword);
    registerPage.confirmPassword().type(invalidData.confirmPassword); 
    registerPage.gender().contains(invalidData.gender).click();
})

Cypress.Commands.add('verifyPasswordFieldTurnRed', () => {
    registerPage.formLabels().contains('Password').should('have.css', 'color', 'rgb(244, 67, 54)')
    registerPage.formRipple().eq(3).should('have.css', 'background-color', 'rgb(244, 67, 54)')
    registerPage.passwordError().should('be.visible')
    registerPage.passwordError().should('have.css', 'color', 'rgb(244, 67, 54)')    
})

Cypress.Commands.add('verifyConfirmPasswordFieldTurnRed', () => {
    registerPage.formLabels().contains('Confirm Password').should('have.css', 'color', 'rgb(244, 67, 54)')
    registerPage.formRipple().eq(4).should('have.css', 'background-color', 'rgb(244, 67, 54)')
    registerPage.confirmPasswordError().should('be.visible')
    registerPage.confirmPasswordError().should('have.css', 'color', 'rgb(244, 67, 54)')    
})

Cypress.Commands.add('verifyAllDisplayedInfoMatchInput', (data) => {
    registerPage.firstName().should('have.value', data.firstName);
    registerPage.lastName().should('have.value', data.lastName)
    registerPage.userName().should('have.value', data.userName)
    registerPage.password().should('have.value', data.password)
    registerPage.confirmPassword().should('have.value', data.password)
    if(data.gender === 'Male') {
        registerPage.gender().find('input[type="radio"][value="Male"]').should('be.checked')
        registerPage.gender().find('input[type="radio"][value="Female"]').should('not.be.checked')
    } else {
        registerPage.gender().find('input[type="radio"][value="Male"]').should('not.be.checked')
        registerPage.gender().find('input[type="radio"][value="Female"]').should('be.checked')
    }
    
})

Cypress.Commands.add('verifyLoginPageElements', () => {
    loginPage.login().should('be.visible');
    loginPage.userName().should('have.attr', 'data-placeholder', 'Username');
    loginPage.password().should('have.attr', 'data-placeholder', 'Password');
})

Cypress.Commands.add('loginUser', (data) => {
    loginPage.userName().type(data.userName);
    loginPage.password().type(data.password);
    loginPage.userName().should('have.value', data.userName);
    loginPage.password().should('have.value', data.password);
    loginPage.login().click()
})

Cypress.Commands.add('logOut', (data) => {
    homePage.userNameHeader().contains(data.userName).click()
    homePage.userMenu().should('be.visible')
    homePage.logout().click()
})

// Cypress.Commands.add('veriFyLoginInfoMatchInput', (data) => {
//     loginPage.userName().should('have.value', data.userName);
//     loginPage.password().should('have.value', data.password);
// })

Cypress.Commands.add('searchBook', (data) => {
    homePage.searchBox().should('have.attr', 'placeholder', 'Search books or authors');
    homePage.searchBox().type(data.exactBookTitle, { delay: 100 })
    homePage.optionText().contains(data.exactBookTitle).click()
})

Cypress.Commands.add('verifyBookDetails', (data) => {
    bookDetailsPage.bookPreviewImage().should('have.length.greaterThan', 0)
    bookDetailsPage.bookInfo().eq(0).contains('Title').should('be.visible')
    bookDetailsPage.bookInfo().eq(0).contains(data.exactBookTitle).should('be.visible')
    bookDetailsPage.bookInfo().eq(1).contains('Author').should('be.visible')
    bookDetailsPage.bookInfo().eq(1).contains(data.exactAuthor).should('be.visible')
    bookDetailsPage.bookInfo().eq(2).contains('Category').should('be.visible')
    bookDetailsPage.bookInfo().eq(2).contains(data.category).should('be.visible')
    bookDetailsPage.bookInfo().eq(3).contains('Price').should('be.visible')
    bookDetailsPage.bookInfo().eq(3).contains(data.price).should('be.visible')
    bookDetailsPage.addToCartButton().should('be.visible')
})

Cypress.Commands.add('verifyPriceSlider', () => {
    homePage.slider().should('be.visible')
    homePage.slider().should('have.attr', 'aria-valuemin', 111)
    homePage.slider().should('have.attr', 'aria-valuemax', 55555)
    homePage.priceLabel().eq(0).should('contain', '₹111.00')
    homePage.priceLabel().eq(1).should('contain', 'to')
    homePage.priceLabel().eq(2).should('contain', '₹55,555.00');
})

Cypress.Commands.add('verifyCartItemHeader', () => {
    shoppingCartPage.cartItemHeader().eq(0).invoke('text').should('eq', 'Image')
    shoppingCartPage.cartItemHeader().eq(1).invoke('text').should('eq', 'Title')
    shoppingCartPage.cartItemHeader().eq(2).invoke('text').should('eq', 'MRP')
    shoppingCartPage.cartItemHeader().eq(3).invoke('text').should('eq', 'Quantity')
    shoppingCartPage.cartItemHeader().eq(4).invoke('text').should('eq', 'Total')
    shoppingCartPage.cartItemHeader().eq(5).invoke('text').should('eq', 'Delete')
})

Cypress.Commands.add('clearCart', () => {
    shoppingCartPage.clearCartButton().click()
    shoppingCartPage.clearCartPopup().should('be.visible')
    shoppingCartPage.emptyShoppingCart().should('be.visible')
    shoppingCartPage.continueShoppingButton().should('be.visible')
})

Cypress.Commands.add('verifyCheckOutPageElements', (data) => {
    checkOutPage.header().should('contain', 'Check Out')
    checkOutPage.cardTitle().eq(0).should('contain', 'Shipping address')
    checkOutPage.cardTitle().eq(1).should('contain', 'Order Summary')
    checkOutPage.name().should('have.attr', 'data-placeholder', 'Name')
    checkOutPage.name().should('have.attr', 'required')
    checkOutPage.addressLine1().should('have.attr', 'data-placeholder', 'Address Line 1')
    checkOutPage.addressLine1().should('have.attr', 'required')
    checkOutPage.addressLine2().should('have.attr', 'data-placeholder', 'Address Line 2')
    checkOutPage.addressLine2().should('have.attr', 'required')
    checkOutPage.pinCode().should('have.attr', 'data-placeholder', 'Pincode')
    checkOutPage.pinCode().should('have.attr', 'required')
    checkOutPage.state().should('have.attr', 'data-placeholder', 'State')
    checkOutPage.state().should('have.attr', 'required')
    checkOutPage.placeOrderButton().should('be.visible')
    checkOutPage.cancelButton().should('be.visible')
    checkOutPage.orderSummaryHeader().eq(0).should('contain', 'Title')
    checkOutPage.orderSummaryHeader().eq(1).should('contain', 'Quantity')
    checkOutPage.orderSummaryHeader().eq(2).should('contain', 'MRP')      
    checkOutPage.orderSummaryHeader().eq(3).should('contain', 'Total')
    checkOutPage.orderSummaryBody().eq(0).find('a').should('have.attr', 'href')
    checkOutPage.orderSummaryBody().eq(0).find('a').should('contain', data.exactBookTitle)
    checkOutPage.orderSummaryBody().eq(1).should('contain', 1)
    checkOutPage.orderSummaryBody().eq(2).should('contain', data.price)
    let total = parseFloat(data.price.replace(/[^0-9.]/g, '')) * 1
    checkOutPage.orderSummaryBody().eq(3).should('contain', `₹${total}`)
    checkOutPage.orderSummaryFooter().find('td').eq(0).should('contain', 'Grand Total')
    checkOutPage.orderSummaryFooter().find('th').eq(2).should('contain', `₹${total}`)
})

function getCurrentDate() {
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let date = new Date();
    let month = monthNames[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }
  
Cypress.Commands.add('verifyOrderPageElements', (data) => {
    myOrdersPage.myOrderHeader().should('contain','Order Id')
    myOrdersPage.myOrderHeader().should('contain','Ordered On')
    myOrdersPage.myOrderHeader().should('contain','Order Total')
    myOrdersPage.orderID().should('have.length.greaterThan', 0)
    myOrdersPage.orderOn().should('contain', getCurrentDate())
    let total = parseFloat(data.price.replace(/[^0-9.]/g, '')) * 1
    myOrdersPage.orderTotal().should('contain', `₹${total}`)
})

Cypress.Commands.add('inputShippingInfo', (data) => {
    checkOutPage.name().type(data.name);
    checkOutPage.addressLine1().type(data.addressLine1);
    checkOutPage.addressLine2().type(data.addressLine2);
    checkOutPage.pinCode().type(data.pinCode);
    checkOutPage.state().type(data.state);

})

  


