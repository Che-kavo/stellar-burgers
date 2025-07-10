import { ingredientsReducer, fetchIngredients } from '../ingredientsSlices';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 100,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('ingredientsSlice', () => {
  it('устанавливает isLoading = true при pending', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('', undefined)
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('записывает ингредиенты при fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled([mockIngredient], '', undefined)
    );
    expect(state.ingredients).toEqual([mockIngredient]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('записывает ошибку при rejected', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.rejected(new Error(), '', undefined, 'Ошибка запроса')
    );
    expect(state.error).toBe('Ошибка запроса');
    expect(state.isLoading).toBe(false);
  });
});
