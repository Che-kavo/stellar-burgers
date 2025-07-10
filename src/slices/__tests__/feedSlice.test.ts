import {
  fetchFeeds,
  fetchFeedOrderByNumber,
  clearFeed,
  feedReducer
} from '../feedSlices';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  name: 'Флюоробургер',
  ingredients: [],
  status: 'done',
  number: 12345,
  createdAt: '',
  updatedAt: ''
};

describe('feedSlice', () => {
  it('сохраняет данные при fetchFeeds.fulfilled', () => {
    const payload = {
      success: true,
      orders: [mockOrder],
      total: 50,
      totalToday: 10
    };

    const state = feedReducer(
      undefined,
      fetchFeeds.fulfilled(payload, '', undefined)
    );
    expect(state.orders).toEqual([mockOrder]);
    expect(state.total).toBe(50);
    expect(state.totalToday).toBe(10);
    expect(state.isLoading).toBe(false);
  });

  it('обрабатывает ошибку при fetchFeeds.rejected', () => {
    const state = feedReducer(
      undefined,
      fetchFeeds.rejected(null, '', undefined, 'Ошибка загрузки')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  it('сохраняет заказ по номеру при fetchFeedOrderByNumber.fulfilled', () => {
    const state = feedReducer(
      undefined,
      fetchFeedOrderByNumber.fulfilled(mockOrder, '', 12345)
    );
    expect(state.selectedFeedOrder).toEqual(mockOrder);
  });

  it('очищает состояние при clearFeed', () => {
    const preloadedState = feedReducer(
      undefined,
      fetchFeeds.fulfilled(
        {
          success: true,
          orders: [mockOrder],
          total: 10,
          totalToday: 5
        },
        '',
        undefined
      )
    );

    const cleared = feedReducer(preloadedState, clearFeed());
    expect(cleared.orders).toEqual([]);
    expect(cleared.total).toBe(0);
    expect(cleared.totalToday).toBe(0);
  });
});
