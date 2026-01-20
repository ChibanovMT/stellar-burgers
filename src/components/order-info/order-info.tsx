import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/feedsSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const orderNumber = number ? parseInt(number, 10) : null;

  const ingredients = useSelector((state) => state.ingredients.items);
  const currentOrder = useSelector((state) => state.feeds.currentOrder);
  const orderFromOrders = useSelector((state) =>
    state.orders.items.find((order) => order.number === orderNumber)
  );
  const orderFromFeeds = useSelector((state) =>
    state.feeds.orders.find((order) => order.number === orderNumber)
  );
  const isLoading = useSelector((state) => state.feeds.isLoading);

  const orderData = currentOrder || orderFromOrders || orderFromFeeds;

  useEffect(() => {
    if (orderNumber && !orderData) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber, orderData]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
