import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsReducer } from './ingredientsSlice';
import { authReducer } from './authSlice';
import { ordersReducer } from './ordersSlice';
import { constructorReducer } from './constructorSlice';
import { feedsReducer } from './feedsSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  orders: ordersReducer,
  constructor: constructorReducer,
  feeds: feedsReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
