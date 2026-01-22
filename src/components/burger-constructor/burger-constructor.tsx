import { FC, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { createOrder } from '../../services/ordersSlice';
import { clearOrderModal } from '../../services/ordersSlice';
import { clearConstructor } from '../../services/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const constructorItems = useSelector((state) => state.constructor);
  const orderRequest = useSelector((state) => state.orders.orderRequest);
  const orderModalData = useSelector((state) => state.orders.orderModalData);

  const onOrderClick = () => {
    if (!constructorItems?.bun || orderRequest) return;
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientsArray = Array.isArray(constructorItems.ingredients)
      ? constructorItems.ingredients
      : [];
    const ingredientIds = [
      constructorItems.bun._id,
      ...ingredientsArray.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch(() => {});
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(() => {
    if (!constructorItems) {
      return 0;
    }
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = Array.isArray(constructorItems.ingredients)
      ? constructorItems.ingredients.reduce((s, v) => s + v.price, 0)
      : 0;
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  const safeConstructorItems = constructorItems || {
    bun: null,
    ingredients: []
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={safeConstructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
