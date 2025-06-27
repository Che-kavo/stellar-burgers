import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RegisterUI } from '@ui-pages';
import { registerUser } from '../../slices/authSlices';
import { AppDispatch } from '../../services/store';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const resultAction = await dispatch(
        registerUser({
          name: userName,
          email,
          password
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        navigate('/login');
      } else if (registerUser.rejected.match(resultAction)) {
        setError(
          resultAction.payload?.toString() ||
            resultAction.error?.message ||
            'Ошибка регистрации'
        );
      }
    } catch (err) {
      setError('Неизвестная ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
