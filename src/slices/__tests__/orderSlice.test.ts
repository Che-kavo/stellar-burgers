import {
  createUserOrder,
  fetchOrderByNumber,
  resetOrderState,
  clearOrder,
  orderReducer
} from '../orderSlices';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order123',
  name: 'Бургер',
  ingredients: [],
  status: 'done',
  createdAt: '',
  updatedAt: '',
  number: 12345
};

describe('orderSlice', () => {
  it('должен сбрасывать состояние при resetOrderState', () => {
    const customState = orderReducer(undefined, {
      type: createUserOrder.fulfilled.type,
      payload: mockOrder
    });

    const clearedState = orderReducer(customState, resetOrderState());
    expect(clearedState.currentOrder).toBe(null);
    expect(clearedState.userOrders).toEqual([]);
  });

  it('записывает заказ при fulfilled createUserOrder', () => {
    const state = orderReducer(undefined, {
      type: createUserOrder.fulfilled.type,
      payload: mockOrder
    });
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.userOrders[0]).toEqual(mockOrder);
  });

  it('обрабатывает pending и rejected createUserOrder', () => {
    const pendingState = orderReducer(
      undefined,
      createUserOrder.pending('', [])
    );
    expect(pendingState.isLoading).toBe(true);

    const rejectedState = orderReducer(
      undefined,
      createUserOrder.rejected(null, '', [], 'ошибка')
    );
    expect(rejectedState.isLoading).toBe(false);
    expect(rejectedState.error).toBe('ошибка');
  });

  it('обрабатывает fetchOrderByNumber.fulfilled', () => {
    const state = orderReducer(
      undefined,
      fetchOrderByNumber.fulfilled(mockOrder, '', 12345)
    );
    expect(state.currentOrder).toEqual(mockOrder);
  });

  it('удаляет текущий заказ при clearOrder', () => {
    const stateWithOrder = orderReducer(undefined, {
      type: createUserOrder.fulfilled.type,
      payload: mockOrder
    });
    const clearedState = orderReducer(stateWithOrder, clearOrder());
    expect(clearedState.currentOrder).toBe(null);
  });
});
