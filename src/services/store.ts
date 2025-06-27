import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { authReducer } from '../slices/authSlices';
import { ingredientsReducer } from '../slices/ingredientsSlices';
import { orderReducer } from '../slices/orderSlices';
import { burgerConstructorReducer } from '../slices/burgerConstructorSlices';
import { feedReducer } from '../slices/feedSlices';

const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
