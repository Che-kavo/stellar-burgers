import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../services/store';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  selectedFeedOrder: TOrder | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  selectedFeedOrder: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заказов');
    }
  }
);

export const fetchFeedOrderByNumber = createAsyncThunk<TOrder, number>(
  'feed/fetchFeedOrderByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://norma.nomoreparties.space/api/orders/${number}`
      );
      const data = await response.json();
      if (!data.success || !data.orders.length) {
        throw new Error('Заказ не найден');
      }
      return data.orders[0];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заказа');
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeed(state) {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.isLoading = false;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeedOrderByNumber.pending, (state) => {
        state.selectedFeedOrder = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeedOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.selectedFeedOrder = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchFeedOrderByNumber.rejected, (state, action) => {
        state.selectedFeedOrder = null;
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

const selectFeedState = (state: RootState) => state.feed;

export const selectFeedOrders = createSelector(
  [selectFeedState],
  (state) => state.orders
);

export const selectFeedOrder = createSelector(
  [selectFeedState],
  (state) => state.selectedFeedOrder
);

export const selectFeedTotal = createSelector(
  [selectFeedState],
  (state) => state.total
);

export const selectFeedTotalToday = createSelector(
  [selectFeedState],
  (state) => state.totalToday
);

export const selectFeedLoading = createSelector(
  [selectFeedState],
  (state) => state.isLoading
);

export const selectFeedError = createSelector(
  [selectFeedState],
  (state) => state.error
);

export const { clearFeed } = feedSlice.actions;

export const feedReducer = feedSlice.reducer;
