import { FC } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { selectIngredientById } from '../../slices/ingredientsSlices';
import { Center } from '../center/center';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isModal = Boolean(location.state?.background);

  const ingredientData = useSelector((state) =>
    selectIngredientById(state, id ?? '')
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  const content = <IngredientDetailsUI ingredientData={ingredientData} />;

  return isModal ? (
    content
  ) : (
    <Center title='Детали ингредиента'>{content}</Center>
  );
};
