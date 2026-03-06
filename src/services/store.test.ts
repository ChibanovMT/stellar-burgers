import { rootReducer } from './store';
import type { RootState } from './store';

describe('rootReducer', () => {
  it('при вызове с undefined состоянием и неизвестным экшеном возвращает корректное начальное состояние хранилища', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const expectedInitialState: RootState = {
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      auth: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      orders: {
        items: [],
        orderRequest: false,
        orderModalData: null,
        isLoading: false,
        error: null
      },
      constructorLALALA: {
        bun: null,
        ingredients: []
      },
      feeds: {
        orders: [],
        total: 0,
        totalToday: 0,
        currentOrder: null,
        isLoading: false,
        error: null
      }
    };

    expect(state).toEqual(expectedInitialState);
  });
});
