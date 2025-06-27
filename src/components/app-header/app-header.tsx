import { FC, memo } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../slices/authSlices';

export const AppHeader: FC = memo(() => {
  const userName = useSelector((state) => selectUser(state)?.name || '');
  return <AppHeaderUI userName={userName} />;
});
