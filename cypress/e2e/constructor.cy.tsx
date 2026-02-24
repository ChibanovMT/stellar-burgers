describe('Конструктор бургера', () => {
  const baseUrl = 'http://localhost:8080';

  beforeEach(() => {
    // Перехватываем все запросы к бэкенду и подменяем данные
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

    cy.visit(`${baseUrl}/`);
    cy.wait('@getIngredients');
  });

  it('отображает страницу конструктора', () => {
    cy.contains('h1', 'Соберите бургер').should('be.visible');
    cy.contains('button', 'Булки').should('be.visible');
    cy.contains('button', 'Начинки').should('be.visible');
    cy.contains('button', 'Соусы').should('be.visible');
    cy.contains('button', 'Оформить заказ').should('be.visible');
  });

  it('добавляет ингредиент из списка в конструктор и отображает счётчик', () => {
    cy.contains('button', 'Добавить').first().click();

    cy.get('[class^="burger-ingredient_container"]')
      .first()
      .within(() => {
        cy.contains('1').should('exist');
      });

    cy.contains('Начинка 1').should('exist');
  });

  it('открывает модальное окно ингредиента и показывает данные выбранного ингредиента, затем закрывает его по крестику', () => {
    let ingredientName = '';

    cy.get('[class^="burger-ingredient_container"]')
      .first()
      .within(() => {
        cy.get('p')
          .last()
          .invoke('text')
          .then((text) => {
            ingredientName = text.trim();
          });
        cy.root().click();
      });

    cy.contains('h3', 'Детали ингредиента').should('be.visible');
    cy.contains('h3', ingredientName).should('be.visible');

    cy.get('[class^="modal_button"]').click();

    cy.contains('h3', 'Детали ингредиента').should('not.exist');
  });

  it('закрывает модальное окно ингредиента по клику на оверлей', () => {
    cy.get('[class^="burger-ingredient_container"]').first().click();

    cy.contains('h3', 'Детали ингредиента').should('be.visible');

    cy.get('[class^="modal-overlay_overlay"]').click({ force: true });

    cy.contains('h3', 'Детали ингредиента').should('not.exist');
  });

  it('при попытке оформить заказ без авторизации происходит переход на страницу логина', () => {
    cy.contains('button', 'Добавить').first().click();

    cy.contains('button', 'Оформить заказ').click();

    cy.location('pathname').should('eq', '/login');
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Подставляем фейковые токены авторизации
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
      // Очищаем токены после теста
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
      cy.clearCookie('accessToken');
    });

    it('создаёт заказ, показывает верный номер, даёт закрыть модалку и очищает конструктор', () => {
      // Добавляем булку и начинку в конструктор
      cy.contains('Булка 1')
        .parents('[class^="burger-ingredient_container"]')
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });

      cy.contains('Начинка 1')
        .parents('[class^="burger-ingredient_container"]')
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });

      cy.contains('Булка 1 (верх)').should('exist');
      cy.contains('Булка 1 (низ)').should('exist');
      cy.contains('Начинка 1').should('exist');

      cy.contains('button', 'Оформить заказ').click();

      cy.wait('@createOrder');

      // Проверяем открытие модального окна и номер заказа
      cy.contains('h2', '12345').should('be.visible');
      cy.contains('идентификатор заказа').should('be.visible');

      // Закрываем модальное окно по крестику
      cy.get('[class^="modal_button"]').click();

      cy.contains('h2', '12345').should('not.exist');
      cy.contains('идентификатор заказа').should('not.exist');

      // Проверяем, что конструктор пуст
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});

