import {
  loginUser,
  registerUser,
  checkUserAuth,
  logoutUser,
  setAuthChecked,
  clearError,
  authReducer
} from '../authSlices';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  name: 'Test User',
  email: 'test@example.com'
};

describe('authSlice', () => {
  it('устанавливает флаг isAuthChecked', () => {
    const state = authReducer(undefined, setAuthChecked());
    expect(state.isAuthChecked).toBe(true);
  });

  it('обрабатывает loginUser.fulfilled', () => {
    const state = authReducer(
      undefined,
      loginUser.fulfilled(mockUser, '', { email: '', password: '' })
    );
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('обрабатывает loginUser.rejected', () => {
    const state = authReducer(
      undefined,
      loginUser.rejected(null, '', { email: '', password: '' }, 'Ошибка')
    );
    expect(state.error).toBe('Ошибка');
    expect(state.user).toBeNull();
  });

  it('обрабатывает registerUser.fulfilled', () => {
    const state = authReducer(
      undefined,
      registerUser.fulfilled(mockUser, '', {
        email: '',
        name: '',
        password: ''
      })
    );
    expect(state.user).toEqual(mockUser);
  });

  it('обрабатывает logoutUser.fulfilled', () => {
    const preloadedState = authReducer(
      undefined,
      loginUser.fulfilled(mockUser, '', { email: '', password: '' })
    );
    const cleared = authReducer(preloadedState, logoutUser.fulfilled(null, ''));
    expect(cleared.user).toBeNull();
    expect(cleared.isAuthChecked).toBe(true);
  });

  it('очищает ошибку через clearError', () => {
    const erroredState = authReducer(
      undefined,
      loginUser.rejected(null, '', { email: '', password: '' }, 'ошибка')
    );
    const cleared = authReducer(erroredState, clearError());
    expect(cleared.error).toBeNull();
  });

  it('обрабатывает checkUserAuth.rejected', () => {
    const state = authReducer(
      undefined,
      checkUserAuth.rejected(null, '', undefined, '401')
    );
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });
});
