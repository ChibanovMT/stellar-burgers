import {
  feedsReducer,
  clearCurrentOrder,
  fetchFeeds,
  fetchOrderByNumber,
  initialState,
  type FeedsState
} from './feedsSlice';

describe('feedsSlice', () => {
  it('должен возвращать начальное состояние по умолчанию', () => {
    const state = feedsReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('должен очищать текущий заказ при clearCurrentOrder', () => {
    const prevState: FeedsState = {
      ...initialState,
      currentOrder: { _id: '1', number: 1 } as any
    };

    const state = feedsReducer(prevState, clearCurrentOrder());

    expect(state.currentOrder).toBeNull();
  });

  it('должен обрабатывать fetchFeeds.pending', () => {
    const state = feedsReducer(initialState, {
      type: fetchFeeds.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchFeeds.fulfilled', () => {
    const payload = {
      orders: [{ _id: '1', number: 1 } as any],
      total: 10,
      totalToday: 5
    };

    const state = feedsReducer(initialState, {
      type: fetchFeeds.fulfilled.type,
      payload
    });

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(5);
  });

  it('должен обрабатывать fetchFeeds.rejected', () => {
    const state = feedsReducer(initialState, {
      type: fetchFeeds.rejected.type,
      payload: 'Ошибка ленты'
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка ленты');
  });

  it('должен обрабатывать fetchOrderByNumber.pending', () => {
    const state = feedsReducer(initialState, {
      type: fetchOrderByNumber.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchOrderByNumber.fulfilled', () => {
    const payload = { _id: '1', number: 1 } as any;

    const state = feedsReducer(initialState, {
      type: fetchOrderByNumber.fulfilled.type,
      payload
    });

    expect(state.isLoading).toBe(false);
    expect(state.currentOrder).toEqual(payload);
  });

  it('должен обрабатывать fetchOrderByNumber.rejected', () => {
    const state = feedsReducer(initialState, {
      type: fetchOrderByNumber.rejected.type,
      payload: 'Ошибка заказа'
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка заказа');
  });
});

