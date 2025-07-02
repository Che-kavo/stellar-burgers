// App.tsx
import React, { useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import {
  AppHeader,
  ProtectedRoute,
  Modal,
  IngredientDetails,
  OrderInfo
} from '@components';
import '../../index.css';
import styles from './app.module.css';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../slices/ingredientsSlices';
import { checkUserAuth } from '../../slices/authSlices';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const handleModalClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const mainRoutes = (
    <Routes location={background || location}>
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed' element={<Feed />} />
      <Route path='/ingredients/:id' element={<IngredientDetails />} />
      <Route path='/feed/:number' element={<OrderInfo />} />
      <Route path='*' element={<NotFound404 />} />

      <Route
        path='/login'
        element={
          <ProtectedRoute onlyAuth={false}>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path='/register'
        element={
          <ProtectedRoute onlyAuth={false}>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route
        path='/forgot-password'
        element={
          <ProtectedRoute onlyAuth={false}>
            <ForgotPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path='/reset-password'
        element={
          <ProtectedRoute onlyAuth={false}>
            <ResetPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedRoute onlyAuth>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile/orders'
        element={
          <ProtectedRoute onlyAuth>
            <ProfileOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile/orders/:number'
        element={
          <ProtectedRoute onlyAuth>
            <OrderInfo />
          </ProtectedRoute>
        }
      />
    </Routes>
  );

  const modalRoutes = background && (
    <Routes>
      <Route
        path='/ingredients/:id'
        element={
          <Modal title='Детали ингредиента' onClose={handleModalClose}>
            <IngredientDetails />
          </Modal>
        }
      />
      <Route
        path='/feed/:number'
        element={
          <Modal title='' onClose={handleModalClose}>
            <OrderInfo />
          </Modal>
        }
      />
      <Route
        path='/profile/orders/:number'
        element={
          <ProtectedRoute onlyAuth>
            <Modal title='' onClose={handleModalClose}>
              <OrderInfo />
            </Modal>
          </ProtectedRoute>
        }
      />
    </Routes>
  );

  return (
    <div className={styles.app}>
      <AppHeader />
      {mainRoutes}
      {modalRoutes}
    </div>
  );
};

export default App;
