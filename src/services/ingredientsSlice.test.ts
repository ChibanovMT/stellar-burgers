import {
  ingredientsReducer,
  fetchIngredients,
  initialState
} from './ingredientsSlice';

describe('ingredientsSlice', () => {
  it('должен возвращать начальное состояние по умолчанию', () => {
    const state = ingredientsReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать fetchIngredients.pending', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchIngredients.fulfilled', () => {
    const payload = [
      { _id: '1', name: 'Булка', type: 'bun', price: 10, image: 'img' }
    ] as any;

    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload
    });

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(payload);
  });

  it('должен обрабатывать fetchIngredients.rejected с сообщением об ошибке', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка'
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
