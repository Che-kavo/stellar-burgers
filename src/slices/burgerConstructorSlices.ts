import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import { RootState } from '../services/store';

interface BurgerConstructorItems {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

interface BurgerConstructorState {
  items: BurgerConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: BurgerConstructorState = {
  items: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  { order: TOrder },
  string[],
  { rejectValue: string }
>(
  'burgerConstructor/createOrder',
  async (ingredientIds, { dispatch, rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      if (!response.success) {
        throw new Error('Ошибка создания заказа');
      }
      dispatch(clearConstructor());
      return { order: response.order };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Неизвестная ошибка при создании заказа'
      );
    }
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.items.bun = action.payload;
        } else {
          state.items.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.items.ingredients = state.items.ingredients.filter(
        (ing) => ing.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = [...state.items.ingredients];
      const [moved] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, moved);
      state.items.ingredients = ingredients;
    },
    clearConstructor: (state) => {
      state.items.bun = null;
      state.items.ingredients = [];
      state.orderModalData = null;
      state.orderRequest = false;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.error = action.payload || 'Ошибка создания заказа';
      });
  }
});

const selectBurgerConstructorState = (state: RootState) =>
  state.burgerConstructor;

export const selectConstructorItems = createSelector(
  [selectBurgerConstructorState],
  (state) => state.items
);

export const selectOrderRequest = createSelector(
  [selectBurgerConstructorState],
  (state) => state.orderRequest
);

export const selectOrderModalData = createSelector(
  [selectBurgerConstructorState],
  (state) => state.orderModalData
);

export const selectLoading = createSelector(
  [selectBurgerConstructorState],
  (state) => state.loading
);

export const selectError = createSelector(
  [selectBurgerConstructorState],
  (state) => state.error
);

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
