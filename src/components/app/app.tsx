import { FC, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUser } from '../../services/authSlice';

type ProtectedRouteProps = {
  children: JSX.Element;
};

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);

  if (!isAuthChecked) {
    return null;
  }

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

const FeedOrderModal: FC = () => {
  const navigate = useNavigate();
  const handleClose = () => navigate('/feed');

  return (
    <Modal title='Детали заказа' onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};

const IngredientModal: FC = () => {
  const navigate = useNavigate();
  const handleClose = () => navigate('/');

  return (
    <Modal title='Детали ингредиента' onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};

const ProfileOrderModal: FC = () => {
  const navigate = useNavigate();
  const handleClose = () => navigate('/profile/orders');

  return (
    <Modal title='Детали заказа' onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/profile'
          element={<ProtectedRoute>{<Profile />}</ProtectedRoute>}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute>{<ProfileOrders />}</ProtectedRoute>}
        />

        <Route path='/feed/:number' element={<FeedOrderModal />} />
        <Route path='/ingredients/:id' element={<IngredientModal />} />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute>{<ProfileOrderModal />}</ProtectedRoute>}
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
