import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const userName = useSelector((state) => state.auth.user?.name || '');

  const handleConstructorClick = () => {
    navigate('/');
  };

  const handleFeedClick = () => {
    navigate('/feed');
  };

  const handleProfileClick = () => {
    if (userName) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <AppHeaderUI
      userName={userName}
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
      onProfileClick={handleProfileClick}
    />
  );
};
