describe('Конструктор бургера', () => {
  const MODAL_INGREDIENT_TITLE = 'Детали ингредиента';
  const BUTTON_ORDER_TEXT = 'Оформить заказ';
  const BUTTON_ADD_TEXT = 'Добавить';
  const ORDER_ID_LABEL = 'идентификатор заказа';
  const ORDER_NUMBER_MOCK = '12345';
  const INGREDIENT_BUN_NAME = 'Булка 1';
  const INGREDIENT_MAIN_NAME = 'Начинка 1';

  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', {
      statusCode: 401,
      body: { success: false, message: 'Not authorized' }
    }).as('getUser');
    cy.intercept('POST', '**/auth/token', {
      statusCode: 401,
      body: { success: false, message: 'Token expired' }
    }).as('refreshToken');
    cy.intercept('GET', '**/orders/all', {
      statusCode: 200,
      body: { success: true, orders: [], total: 0, totalToday: 0 }
    }).as('getFeeds');
    cy.intercept('GET', '**/orders/*', {
      statusCode: 200,
      body: { success: true, orders: [] }
    }).as('getOrderByNumber');
    cy.intercept('GET', '**/orders', {
      statusCode: 200,
      body: { success: true, orders: [] }
    }).as('getOrders');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('отображает страницу конструктора', () => {
    cy.contains('h1', 'Соберите бургер').should('be.visible');
    cy.contains('button', 'Булки').should('be.visible');
    cy.contains('button', 'Начинки').should('be.visible');
    cy.contains('button', 'Соусы').should('be.visible');
    cy.contains('button', BUTTON_ORDER_TEXT).should('be.visible');
  });

  it('добавляет булку и начинку из списка в конструктор', () => {
    cy.contains('li', INGREDIENT_BUN_NAME).within(() => {
      cy.contains('button', BUTTON_ADD_TEXT).click();
    });
    cy.contains('Булка 1 (верх)').should('be.visible');
    cy.contains('Булка 1 (низ)').should('be.visible');

    cy.contains('li', INGREDIENT_MAIN_NAME).within(() => {
      cy.contains('button', BUTTON_ADD_TEXT).click();
    });
    cy.contains(INGREDIENT_MAIN_NAME).should('be.visible');
  });

  it('открывает модальное окно ингредиента по клику на карточку и закрывает по крестику', () => {
    cy.contains('li', INGREDIENT_MAIN_NAME).click();

    cy.contains('h3', MODAL_INGREDIENT_TITLE).should('be.visible');
    cy.contains('h3', INGREDIENT_MAIN_NAME).should('be.visible');

    cy.contains('h3', MODAL_INGREDIENT_TITLE).parent().find('button').click();

    cy.contains('h3', MODAL_INGREDIENT_TITLE).should('not.exist');
  });

  it('закрывает модальное окно ингредиента по клику на оверлей', () => {
    cy.contains('li', INGREDIENT_BUN_NAME).click();

    cy.contains('h3', MODAL_INGREDIENT_TITLE).should('be.visible');

    cy.get('[class*="overlay"]').click({ force: true });

    cy.contains('h3', MODAL_INGREDIENT_TITLE).should('not.exist');
  });

  it('при попытке оформить заказ без авторизации происходит переход на страницу логина', () => {
    cy.contains('li', INGREDIENT_BUN_NAME).within(() => {
      cy.contains('button', BUTTON_ADD_TEXT).click();
    });
    cy.contains('button', BUTTON_ORDER_TEXT).click();

    cy.location('pathname').should('eq', '/login');
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });
      cy.setCookie('accessToken', 'test-access-token');
      cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as(
        'getUserAuthorized'
      );
      cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
      cy.clearCookie('accessToken');
    });

    it('создаёт заказ, показывает номер, закрывает модалку и очищает конструктор', () => {
      cy.contains('li', INGREDIENT_BUN_NAME).within(() => {
        cy.contains('button', BUTTON_ADD_TEXT).click();
      });
      cy.contains('li', INGREDIENT_MAIN_NAME).within(() => {
        cy.contains('button', BUTTON_ADD_TEXT).click();
      });

      cy.contains('Булка 1 (верх)').should('exist');
      cy.contains('Булка 1 (низ)').should('exist');
      cy.contains(INGREDIENT_MAIN_NAME).should('exist');

      cy.contains('button', BUTTON_ORDER_TEXT).click();

      cy.wait('@createOrder');

      cy.contains('h2', ORDER_NUMBER_MOCK).should('be.visible');
      cy.contains(ORDER_ID_LABEL).should('be.visible');

      cy.contains('h2', ORDER_NUMBER_MOCK).parent().parent().find('button').click();

      cy.contains('h2', ORDER_NUMBER_MOCK).should('not.exist');

      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
