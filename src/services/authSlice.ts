import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../utils/cookie';

export type AuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const fetchUser = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const data = await getUserApi();
    return data.user;
  } catch (err) {
    return rejectWithValue('Не удалось получить пользователя');
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('auth/loginUser', async (payload, { rejectWithValue }) => {
  try {
    const data = await loginUserApi(payload);
    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);
    return data.user;
  } catch (err) {
    return rejectWithValue('Не удалось авторизоваться');
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    const data = await registerUserApi(payload);
    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);
    return data.user;
  } catch (err) {
    return rejectWithValue('Не удалось зарегистрироваться');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (err) {
      return rejectWithValue('Не удалось выйти');
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('auth/updateUser', async (payload, { rejectWithValue }) => {
  try {
    const data = await updateUserApi(payload);
    return data.user;
  } catch (err) {
    return rejectWithValue('Не удалось обновить данные профиля');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка авторизации';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка регистрации';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка обновления профиля';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const authReducer = authSlice.reducer;

