import {
  burgerConstructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../burgerConstructorSlices';
import { TIngredient } from '@utils-types';

const bun: TIngredient = {
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

const sauce: TIngredient = {
  ...bun,
  _id: '2',
  name: 'Соус',
  type: 'sauce'
};

describe('burgerConstructorSlice', () => {
  it('должен добавлять булку', () => {
    const state = burgerConstructorReducer(undefined, addIngredient(bun));
    expect(state.items.bun?._id).toBe('1');
  });

  it('должен добавлять начинку с id', () => {
    const state = burgerConstructorReducer(undefined, addIngredient(sauce));
    expect(state.items.ingredients.length).toBe(1);
    expect(state.items.ingredients[0]).toHaveProperty('id');
  });

  it('удаляет ингредиент по id', () => {
    const initial = burgerConstructorReducer(undefined, addIngredient(sauce));
    const id = initial.items.ingredients[0].id;
    const state = burgerConstructorReducer(initial, removeIngredient(id));
    expect(state.items.ingredients.length).toBe(0);
  });

  it('меняет порядок ингредиентов', () => {
    const first = { ...sauce, id: '1' };
    const second = { ...sauce, id: '2' };
    const state = {
      ...burgerConstructorReducer(undefined, clearConstructor()),
      items: { bun: null, ingredients: [first, second] },
      orderRequest: false,
      orderModalData: null,
      loading: false,
      error: null
    };
    const result = burgerConstructorReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );
    expect(result.items.ingredients.map((i) => i.id)).toEqual(['2', '1']);
  });
});
