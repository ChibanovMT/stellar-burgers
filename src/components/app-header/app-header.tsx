import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isConstructorActive =
    location.pathname === '/' || location.pathname.startsWith('/ingredients');
  const isFeedActive =
    location.pathname === '/feed' || location.pathname.startsWith('/feed/');
  const isProfileActive =
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/login');

  return (
    <AppHeaderUI
      userName={userName}
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
      onProfileClick={handleProfileClick}
      isConstructorActive={isConstructorActive}
      isFeedActive={isFeedActive}
      isProfileActive={isProfileActive}
    />
  );
};
