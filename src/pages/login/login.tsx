import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LoginUI } from '@ui-pages';
import { loginUser } from '../../slices/authSlices';
import { AppDispatch } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        navigate(from);
      } else if (loginUser.rejected.match(resultAction)) {
        if (resultAction.payload) {
          setError(resultAction.payload as string);
        } else if (resultAction.error) {
          setError(resultAction.error.message || 'Ошибка входа');
        }
      }
    } catch (err) {
      setError('Неизвестная ошибка при входе');
    }
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
