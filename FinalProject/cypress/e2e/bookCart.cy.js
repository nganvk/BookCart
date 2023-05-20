import bookDetailsPage from "../pages/bookDetailsPage";
import homePage from "../pages/homePage"
import loginPage from "../pages/loginPage"
import registerPage from "../pages/registerPage"
import searchPage from "../pages/searchPage";
import shoppingCartPage from "../pages/shoppingCartPage";
import checkOutPage from "../pages/checkOutPage";
import myOrdersPage from "../pages/myOrdersPage";

// Hide fetch/XHR requests
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');

  app.document.head.appendChild(style);
}

describe('User Registration and Authentication', () => {

  beforeEach(() => {
    cy.visit('https://bookcart.azurewebsites.net/');
    cy.navigateToLoginPage()
  });
  
  it ('TC01-Successfully register a new account after providing valid required information', () => {
    cy.fixture('inputData.json').then((data) => {
      loginPage.registerButton().should('be.visible');
      cy.navigateToRegisterPage();
      cy.verifyRegisterPageElements();
      cy.registerUser(data);
      cy.verifyAllDisplayedInfoMatchInput(data);
      registerPage.registerButton().click();
      cy.wait(3000);
      cy.url().should('include', '/login');
      cy.verifyLoginPageElements();
      cy.loginUser(data);
      cy.url().should('eq', 'https://bookcart.azurewebsites.net/');
      homePage.favoriteIcon().should('be.visible');
      homePage.userNameHeader().should('contain', data.userName);
    })
  })

  it ('TC02-Verify all the required fields turn red when they are left empty', () => {
      cy.navigateToRegisterPage();
      registerPage.registerButton().click();
      cy.wait(3000);
      cy.url().should('include', '/register');
      registerPage.formLabels().should('have.css', 'color', 'rgb(244, 67, 54)');
      registerPage.formRipple().should('have.css', 'background-color', 'rgb(244, 67, 54)')
    });

  it ('TC03-Verify password field turn red and display the error message when user input invalid password', () => {
    cy.fixture('invalidData.json').then((invalidData) => {
      cy.navigateToRegisterPage();
      cy.registerUserwithInvalidPassword(invalidData)
      cy.verifyPasswordFieldTurnRed()
    })
  }); 
    
  it ('TC04-Verify Confirm password field turn red and display the error message when the input does not match Password', () => {
    cy.fixture('invalidData.json').then((invalidData) => {
      cy.navigateToRegisterPage();
      cy.registerUserwithInvalidConfirmPassword(invalidData)
      cy.verifyConfirmPasswordFieldTurnRed()
    })
  }); 

  it ('TC05-Verify user can log out of the account', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.loginUser(data)
      cy.url().should('eq', 'https://bookcart.azurewebsites.net/');
      cy.logOut(data);
      cy.url().should('include', '/login')
    })
  });

  it ('TC06-Verify all input fields of Login page turn red when left blank', () => {
    cy.fixture('inputData.json').then((data) => {
      loginPage.login().click();
      loginPage.labels().should('have.css', 'color', 'rgb(244, 67, 54)');
      loginPage.underline().should('have.css', 'background-color', 'rgb(244, 67, 54)');
    })
  });
})

describe('Searching and filtering', () => {

  beforeEach(() => {
    cy.visit('https://bookcart.azurewebsites.net/')
  })

  it ('TC01-Verify that not logged-in user can search for a book by its exact title', () => {
    cy.fixture('inputData.json').then((data) => { 
      cy.searchBook(data)
      searchPage.searchResult().should('have.text', data.exactBookTitle);
      searchPage.searchResult().click();
      cy.url().should('include', '/books/details/')
      cy.verifyBookDetails(data)
      bookDetailsPage.getSimilarBooks().should('have.length', 5)
      })
    })

  it ('TC02-Verify that not logged-in user can search for a book by its partial title', () => {
    cy.fixture('inputData.json').then((data) => { 
      homePage.searchBox().type(data.partialBookTitle, {delay: 100});
      homePage.optionText().should('contain', data.partialBookTitle);
      homePage.optionText().contains(data.exactBookTitle).click();
      searchPage.searchResult().should('have.text', data.exactBookTitle);
      })
    })

  it ('TC03-Verify that not logged-in user can search for a book by its exact author name', () => {
    cy.fixture('inputData.json').then((data) => { 
      homePage.searchBox().type(data.exactAuthor, {delay: 100});
      homePage.optionText().contains(data.exactBookTitle).click();
      searchPage.searchResult().click();
      bookDetailsPage.bookInfo().eq(1).find('td').eq(1).should('have.text', data.exactAuthor)
      })
    })

  it ('TC04-Verify that not logged-in user can search for a book by its partial author', () => {
    cy.fixture('inputData.json').then((data) => { 
      homePage.searchBox().type(data.partialAuthor, { delay: 100 });
      homePage.optionText().contains(data.exactBookTitle).click();
      searchPage.searchResult().click();
      bookDetailsPage.bookInfo().eq(1).find('td').eq(1).should('contain', data.partialAuthor)
      })
   })

  it ('TC05-Verify that logged-in user can search for a book by its exact title', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.navigateToLoginPage();
      cy.loginUser(data);
      homePage.favoriteIcon().should('be.visible');
      homePage.userNameHeader().should('contain', data.userName)
      cy.searchBook(data);
      searchPage.searchResult().click();
      cy.url().should('include', '/books/details/');   
      })
    })

  it ('TC06-Verify that logged-in user can search for a book by its partial title', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.navigateToLoginPage();
      cy.loginUser(data);
      homePage.favoriteIcon().should('be.visible');
      homePage.userNameHeader().should('contain', data.userName)
      homePage.searchBox().type(data.partialBookTitle, {delay: 100});
      homePage.optionText().should('contain', data.partialBookTitle);
      homePage.optionText().contains(data.exactBookTitle).click();
      searchPage.searchResult().should('contain', data.partialBookTitle);
      })
    })

  it ('TC07-Verify that logged-in user can search for a book by its exact author name', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.navigateToLoginPage();
      cy.loginUser(data);
      homePage.favoriteIcon().should('be.visible');
      homePage.userNameHeader().should('contain', data.userName)
      homePage.searchBox().type(data.exactAuthor, {delay: 100});
      homePage.optionText().contains(data.exactBookTitle).click();
      searchPage.searchResult().click();
      bookDetailsPage.bookInfo().eq(1).find('td').eq(1).should('have.text', data.exactAuthor);
      })
    })

  it ('TC08-Verify that logged-in user can search for a book by its partial author', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.navigateToLoginPage();
      cy.loginUser(data);
      homePage.favoriteIcon().should('be.visible');
      homePage.userNameHeader().should('contain', data.userName)
      homePage.searchBox().type(data.partialAuthor, { delay: 100 });
      homePage.optionText().contains(data.exactBookTitle).click();
      searchPage.searchResult().click();
      bookDetailsPage.bookInfo().eq(1).find('td').eq(1).should('contain', data.partialAuthor)
      })
   })

  it ('TC09-Verify not logged-in user can filter books by category', () => {
    cy.fixture('inputData.json').then((data) => {
      homePage.categoryList().should('be.visible');
      homePage.categoryOption().contains(data.category).click();
      cy.url().should('include', `filter?category=${data.category.toLowerCase()}`);
      })
   })

  it ('TC10-Verify logged-in user can filter books by category', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.navigateToLoginPage();
      cy.loginUser(data);
      homePage.favoriteIcon().should('be.visible');
      homePage.userNameHeader().should('contain', data.userName)
      homePage.categoryList().should('be.visible');
      homePage.categoryOption().contains(data.category).click();
      cy.url().should('include', `filter?category=${data.category.toLowerCase()}`);
      })
    }) 
    
  it ('TC11-Verify books of all category are showed when select "All categories"  from the filter panel', () => {
    cy.fixture('inputData.json').then((data) => {
      homePage.categoryList().should('be.visible');
      homePage.categoryOption().contains(data.category).click();
      cy.url().should('include', `filter?category=${data.category.toLowerCase()}`);
      homePage.categoryOption().contains(data.allCategory).click();
      cy.url().should('eq', 'https://bookcart.azurewebsites.net/');
      })
    })  

  it ('TC12-Verify not logged in user can filter books by a valid price range', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.verifyPriceSlider()
      homePage.slider().type('{rightarrow}'.repeat(400)).type('{leftarrow}'.repeat(552))
      homePage.priceLabel().eq(2).should('contain', '₹355.00')
      homePage.bookCardPrice().each(($bookcard) => {
        cy.wrap($bookcard).invoke('text').then((text) => {
          let price = parseInt(text.replace(/[^0-9.]/g,''));
          return price;
        })
        .should('be.lte', 355)
      })
    })
  })

  it ('TC13-Verify logged in user can filter books by a valid price range', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.navigateToLoginPage();
      cy.loginUser(data);
      homePage.favoriteIcon().should('be.visible');
      homePage.userNameHeader().should('contain', data.userName)
      homePage.slider().type('{rightarrow}'.repeat(400)).type('{leftarrow}'.repeat(552))
      homePage.priceLabel().eq(2).should('contain', '₹355.00')
      homePage.bookCardPrice().each(($bookcard) => {
        cy.wrap($bookcard).invoke('text').then((text) => {
          let price = parseInt(text.replace(/[^0-9.]/g,''));
          return price;
        })
        .should('be.lte', 355)
      })
    })
  })
})

describe ('Shopping Cart Management', () => {

  beforeEach(() => {
    cy.visit('https://bookcart.azurewebsites.net/');
  })

  it ('TC01-Verify not logged-in user can add and remove books from the shopping cart', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.searchBook(data);
      searchPage.searchResult().click()
      bookDetailsPage.addToCartButton().click();
      homePage.addToCartPopup().should('be.visible')
      homePage.shoppingCartIcon().should('contain', 1)
      homePage.shoppingCartIcon().contains('shopping_cart').click();
      cy.url().should('contain', '/shopping-cart')
      shoppingCartPage.clearCartButton().should('be.visible')
      cy.verifyCartItemHeader()
      shoppingCartPage.cartItemBody().eq(0).find('img').should('have.length.gt', 0)
      shoppingCartPage.cartItemBody().eq(1).find('a').should('have.attr', 'href')
      shoppingCartPage.cartItemBody().eq(1).find('a').invoke('text').should('eq', data.exactBookTitle)
      shoppingCartPage.cartItemBody().eq(2).invoke('text').should('eq', data.price)
      shoppingCartPage.cartItemBody().eq(3).should('contain', 1)
      let total = (parseFloat(data.price.replace(/[^0-9.]/g, '')) * 1).toFixed(2)
      shoppingCartPage.cartItemBody().eq(4).invoke('text').should('eq', `₹${total}`)
      shoppingCartPage.cartItemBody().eq(5).find('mat-icon').should('contain', 'delete')
      shoppingCartPage.cartItemFooter().find('td').eq(0).invoke('text').should('eq', 'Cart Total:')
      shoppingCartPage.cartItemFooter().find('th').eq(3).invoke('text').should('eq', `₹${total}`)
      shoppingCartPage.checkOutButton().should('be.visible')
      cy.wait(5000)
      cy.clearCart()
    })
  })

  it ('TC02-Verify not logged-in user can edit the number of books in the cart', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.searchBook(data);
      searchPage.searchResult().click();
      bookDetailsPage.addToCartButton().click();
      homePage.shoppingCartIcon().contains('shopping_cart').click();
      shoppingCartPage.minusButton().should('be.visible')
      shoppingCartPage.plusButton().should('be.visible')
      shoppingCartPage.plusButton().click()
      homePage.addToCartPopup().should('be.visible')
      homePage.shoppingCartIcon().should('contain', 2)
      shoppingCartPage.cartItemBody().eq(3).should('contain', 2)
      let total = (parseFloat(data.price.replace(/[^0-9.]/g, '')) * 2).toFixed(2)
      shoppingCartPage.cartItemBody().eq(4).invoke('text').should('eq', `₹${total}`)
      shoppingCartPage.cartItemFooter().find('th').eq(3).should('contain', `₹${total}`)
    })
  })

  it ('TC03-Verify logged-in user can add and remove books from their shopping cart; the cart should then update.', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.navigateToLoginPage();
      cy.loginUser(data);
      cy.searchBook(data);
      searchPage.searchResult().click()
      bookDetailsPage.addToCartButton().click();
      homePage.shoppingCartIcon().should('contain', 1)
      homePage.shoppingCartIcon().contains('shopping_cart').click();
      shoppingCartPage.cartItemBody().eq(3).should('contain', 1)
      cy.wait(5000)
      cy.clearCart()
    })
  })

  it ('TC04-Verify logged-in user can edit the number of books in the cart', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.navigateToLoginPage();
      cy.loginUser(data);
      cy.searchBook(data);
      searchPage.searchResult().click();
      bookDetailsPage.addToCartButton().click();
      homePage.shoppingCartIcon().contains('shopping_cart').click();
      shoppingCartPage.plusButton().click()
      homePage.addToCartPopup().should('be.visible')
      homePage.shoppingCartIcon().should('contain', 2)
      shoppingCartPage.cartItemBody().eq(3).should('contain', 2)
      let total = (parseFloat(data.price.replace(/[^0-9.]/g, '')) * 2).toFixed(2)
      shoppingCartPage.cartItemBody().eq(4).invoke('text').should('eq', `₹${total}`)
      shoppingCartPage.cartItemFooter().find('th').eq(3).should('contain', `₹${total}`)
    })
  })

})



describe ('Checkout process', () => {

  beforeEach(() => {
    cy.visit('https://bookcart.azurewebsites.net/')
  })

  it ('TC01-Verify that logged-in user successfully completes the checkout process', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.navigateToLoginPage();
      cy.loginUser(data);
      cy.searchBook(data);
      searchPage.searchResult().click();
      bookDetailsPage.addToCartButton().click();
      homePage.shoppingCartIcon().contains('shopping_cart').click()
      shoppingCartPage.checkOutButton().click()
      cy.url().should('contain', 'checkout')
      cy.verifyCheckOutPageElements(data);
      cy.inputShippingInfo(data)
      checkOutPage.placeOrderButton().click()
      checkOutPage.orderSuccessPopup().should('be.visible')
      cy.url().should('contain', '/myorders')
      cy.verifyOrderPageElements(data)
      homePage.shoppingCartIcon().should('contain', 0)
    })
  })

  it ('TC02-Verify input fields of Check Out Page turn red when left blank', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.navigateToLoginPage();
      cy.loginUser(data);
      cy.searchBook(data);
      searchPage.searchResult().click();
      bookDetailsPage.addToCartButton().click();
      homePage.shoppingCartIcon().contains('shopping_cart').click()
      shoppingCartPage.checkOutButton().click()
      checkOutPage.placeOrderButton().click()
      checkOutPage.formLabel().should('have.css', 'color', 'rgb(244, 67, 54)')
      checkOutPage.formRipple().should('have.css', 'background-color', 'rgb(244, 67, 54)')
    }) 
  })

  it ('TC03-Verify user is redirected to Shopping Cart page when checkout process is cancelled', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.navigateToLoginPage();
      cy.loginUser(data);
      cy.searchBook(data);
      searchPage.searchResult().click();
      bookDetailsPage.addToCartButton().click();
      homePage.shoppingCartIcon().contains('shopping_cart').click()
      shoppingCartPage.checkOutButton().click()
      checkOutPage.cancelButton().click()
      cy.url().should('contain', '/shopping-cart')
      shoppingCartPage.cartItemBody().eq(1).find('a').should('contain', data.exactBookTitle)
      shoppingCartPage.cartItemBody().eq(3).should('contain', 1)
    })
  })

  it ('TC04-Verify Login Page is Displayed When a User Tries to Checkout While Not Logged In', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.searchBook(data);
      searchPage.searchResult().click();
      bookDetailsPage.addToCartButton().click();
      homePage.shoppingCartIcon().contains('shopping_cart').click()
      shoppingCartPage.checkOutButton().click()
      cy.url().should('contain', '/login')
    })
  })

})

describe ('Order history', () => {

  beforeEach(() => {
    cy.visit('https://bookcart.azurewebsites.net/')
  })

  it('TC12-Verify user can view order history', () => {
    cy.fixture('inputData.json').then((data) => {
      cy.navigateToLoginPage()
      cy.loginUser(data)
      loginPage.login().click()
      homePage.userNameHeader().click()
      cy.get('.mat-menu-item').contains('My Orders').click();
      cy.url().should('contain', '/myorders')
      myOrdersPage.orderID().should('have.length.greaterThan', 0)
      myOrdersPage.orderOn().should('have.length.greaterThan', 0)
      myOrdersPage.orderTotal().should('have.length.greaterThan', 0)
    })  
  })
})

