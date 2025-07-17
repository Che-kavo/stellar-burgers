import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен возвращать корректный initialState', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('feed');
  });
});
