import { FC, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '../../slices/ingredientsSlices';
import {
  fetchOrderByNumber,
  selectCurrentOrder
} from '../../slices/orderSlices';
import {
  fetchFeedOrderByNumber,
  selectFeedOrder
} from '../../slices/feedSlices';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const isProfile = location.pathname.startsWith('/profile');

  const ingredients = useSelector(selectIngredients);
  const orderData = useSelector(
    isProfile ? selectCurrentOrder : selectFeedOrder
  );

  useEffect(() => {
    if (!number) return;
    const orderNumber = parseInt(number);

    if (isProfile) {
      dispatch(fetchOrderByNumber(orderNumber));
    } else {
      dispatch(fetchFeedOrderByNumber(orderNumber));
    }
  }, [dispatch, number, isProfile]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, id) => {
        if (!acc[id]) {
          const ing = ingredients.find((i) => i._id === id);
          if (ing) {
            acc[id] = { ...ing, count: 1 };
          }
        } else {
          acc[id].count += 1;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
