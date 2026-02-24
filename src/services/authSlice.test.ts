import {
  authReducer,
  fetchUser,
  loginUser,
  registerUser,
  logoutUser,
  updateUser,
  type AuthState
} from './authSlice';

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null
  };

  it('должен возвращать начальное состояние по умолчанию', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать fetchUser.pending', () => {
    const state = authReducer(initialState, {
      type: fetchUser.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchUser.fulfilled', () => {
    const payload = { name: 'User', email: 'user@test.com' } as any;

    const state = authReducer(initialState, {
      type: fetchUser.fulfilled.type,
      payload
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(payload);
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен обрабатывать fetchUser.rejected', () => {
    const state = authReducer(initialState, {
      type: fetchUser.rejected.type
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен обрабатывать loginUser.pending', () => {
    const state = authReducer(initialState, {
      type: loginUser.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать loginUser.fulfilled', () => {
    const payload = { name: 'User', email: 'user@test.com' } as any;

    const state = authReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(payload);
  });

  it('должен обрабатывать loginUser.rejected', () => {
    const state = authReducer(initialState, {
      type: loginUser.rejected.type,
      payload: 'Ошибка авторизации'
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка авторизации');
  });

  it('должен обрабатывать registerUser.pending', () => {
    const state = authReducer(initialState, {
      type: registerUser.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать registerUser.fulfilled', () => {
    const payload = { name: 'User', email: 'user@test.com' } as any;

    const state = authReducer(initialState, {
      type: registerUser.fulfilled.type,
      payload
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(payload);
  });

  it('должен обрабатывать registerUser.rejected', () => {
    const state = authReducer(initialState, {
      type: registerUser.rejected.type,
      payload: 'Ошибка регистрации'
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка регистрации');
  });

  it('должен обрабатывать updateUser.pending', () => {
    const state = authReducer(initialState, {
      type: updateUser.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать updateUser.fulfilled', () => {
    const payload = { name: 'New', email: 'new@test.com' } as any;

    const state = authReducer(initialState, {
      type: updateUser.fulfilled.type,
      payload
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(payload);
  });

  it('должен обрабатывать updateUser.rejected', () => {
    const state = authReducer(initialState, {
      type: updateUser.rejected.type,
      payload: 'Ошибка обновления'
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка обновления');
  });

  it('должен обрабатывать logoutUser.pending', () => {
    const state = authReducer(initialState, {
      type: logoutUser.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать logoutUser.fulfilled', () => {
    const prevState: AuthState = {
      ...initialState,
      user: { name: 'User', email: 'user@test.com' } as any
    };

    const state = authReducer(prevState, {
      type: logoutUser.fulfilled.type
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
  });

  it('должен обрабатывать logoutUser.rejected', () => {
    const prevState: AuthState = {
      ...initialState,
      user: { name: 'User', email: 'user@test.com' } as any
    };

    const state = authReducer(prevState, {
      type: logoutUser.rejected.type,
      payload: 'Ошибка выхода'
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBe('Ошибка выхода');
  });
});

