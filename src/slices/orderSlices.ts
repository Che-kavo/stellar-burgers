import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getOrderByNumberApi,
  getOrdersApi,
  getFeedsApi
} from '../utils/burger-api';
import { TOrder, TOrdersData } from '@utils-types';
import { RootState } from '../services/store';

type TOrderState = {
  currentOrder: TOrder | null;
  userOrders: TOrder[];
  feedOrders: TOrder[];
  isLoading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
};

const initialState: TOrderState = {
  currentOrder: null,
  userOrders: [],
  feedOrders: [],
  isLoading: false,
  error: null,
  total: 0,
  totalToday: 0
};

export const createUserOrder = createAsyncThunk<TOrder, string[]>(
  'order/create',
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      if (!response.success) throw new Error('Ошибка создания заказа');
      return response.order;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      if (!response.success) throw new Error('Заказ не найден');
      return response.orders[0];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка сервера'
      );
    }
  }
);

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'order/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки заказов'
      );
    }
  }
);

export const fetchFeedOrders = createAsyncThunk<TOrdersData>(
  'order/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      if (!response.success) throw new Error('Ошибка загрузки ленты заказов');
      return {
        orders: response.orders,
        total: response.total,
        totalToday: response.totalToday
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка сервера'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
    resetOrderState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.userOrders.unshift(action.payload);
      })
      .addCase(createUserOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeedOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedOrders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectOrderRequest = (state: RootState) => state.order.isLoading;
export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;
export const selectUserOrders = (state: RootState) => state.order.userOrders;
export const selectFeedOrders = (state: RootState) => state.order.feedOrders;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderError = (state: RootState) => state.order.error;
export const selectOrderStats = (state: RootState) => ({
  total: state.order.total,
  totalToday: state.order.totalToday
});

export const { clearOrder, resetOrderState } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
