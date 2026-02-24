import {
  ordersReducer,
  clearOrderModal,
  fetchUserOrders,
  createOrder,
  type OrdersState
} from './ordersSlice';

describe('ordersSlice', () => {
  const initialState: OrdersState = {
    items: [],
    orderRequest: false,
    orderModalData: null,
    isLoading: false,
    error: null
  };

  it('должен возвращать начальное состояние по умолчанию', () => {
    const state = ordersReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('должен очищать модальное окно заказа при clearOrderModal', () => {
    const prevState: OrdersState = {
      ...initialState,
      orderRequest: true,
      orderModalData: { _id: '1' } as any
    };

    const state = ordersReducer(prevState, clearOrderModal());

    expect(state.orderModalData).toBeNull();
    expect(state.orderRequest).toBe(false);
  });

  it('должен обрабатывать fetchUserOrders.pending', () => {
    const state = ordersReducer(initialState, {
      type: fetchUserOrders.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchUserOrders.fulfilled', () => {
    const payload = [{ _id: '1', number: 1 } as any];

    const state = ordersReducer(initialState, {
      type: fetchUserOrders.fulfilled.type,
      payload
    });

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(payload);
  });

  it('должен обрабатывать fetchUserOrders.rejected', () => {
    const state = ordersReducer(initialState, {
      type: fetchUserOrders.rejected.type,
      payload: 'Ошибка загрузки'
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  it('должен обрабатывать createOrder.pending', () => {
    const state = ordersReducer(initialState, {
      type: createOrder.pending.type
    });

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать createOrder.fulfilled', () => {
    const payload = { _id: '1', number: 1 } as any;

    const state = ordersReducer(initialState, {
      type: createOrder.fulfilled.type,
      payload
    });

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(payload);
  });

  it('должен обрабатывать createOrder.rejected', () => {
    const state = ordersReducer(initialState, {
      type: createOrder.rejected.type,
      payload: 'Ошибка создания'
    });

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка создания');
  });
});

