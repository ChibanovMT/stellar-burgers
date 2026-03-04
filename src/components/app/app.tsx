import { FC, useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
  IngredientDetailsPage,
  OrderDetailsPage
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUser } from '../../services/authSlice';
import { fetchIngredients } from '../../services/ingredientsSlice';

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

type ProtectedAuthRouteProps = {
  children: JSX.Element;
};

const ProtectedAuthRoute: FC<ProtectedAuthRouteProps> = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);

  if (!isAuthChecked) {
    return null;
  }

  if (user) {
    return <Navigate to='/' replace />;
  }

  return children;
};

const FeedOrderModal: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = (location.state as { background?: Location })?.background;
  const handleClose = () =>
    navigate(background?.pathname || '/feed', { replace: true });

  return (
    <Modal title='Детали заказа' onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};

const IngredientModal: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = (location.state as { background?: Location })?.background;
  const handleClose = () =>
    navigate(background?.pathname || '/', { replace: true });

  return (
    <Modal title='Детали ингредиента' onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};

const ProfileOrderModal: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = (location.state as { background?: Location })?.background;
  const handleClose = () =>
    navigate(background?.pathname || '/profile/orders', { replace: true });

  return (
    <Modal title='Детали заказа' onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredients.items);

  useEffect(() => {
    dispatch(fetchUser());
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const location = useLocation();
  const background = (location.state as { background?: Location })?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={<ProtectedAuthRoute>{<Login />}</ProtectedAuthRoute>}
        />
        <Route
          path='/register'
          element={<ProtectedAuthRoute>{<Register />}</ProtectedAuthRoute>}
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedAuthRoute>{<ForgotPassword />}</ProtectedAuthRoute>
          }
        />
        <Route
          path='/reset-password'
          element={<ProtectedAuthRoute>{<ResetPassword />}</ProtectedAuthRoute>}
        />
        <Route
          path='/profile'
          element={<ProtectedRoute>{<Profile />}</ProtectedRoute>}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute>{<ProfileOrders />}</ProtectedRoute>}
        />

        <Route path='/ingredients/:id' element={<IngredientDetailsPage />} />
        <Route path='/feed/:number' element={<OrderDetailsPage />} />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute>{<OrderDetailsPage />}</ProtectedRoute>}
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route path='/feed/:number' element={<FeedOrderModal />} />
          <Route path='/ingredients/:id' element={<IngredientModal />} />
          <Route
            path='/profile/orders/:number'
            element={<ProtectedRoute>{<ProfileOrderModal />}</ProtectedRoute>}
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
