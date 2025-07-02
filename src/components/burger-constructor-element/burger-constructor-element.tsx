import { FC, memo, useCallback } from 'react';
import { useDispatch } from '../../services/store';
import {
  removeIngredient,
  moveIngredient
} from '../../slices/burgerConstructorSlices';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveUp = useCallback(() => {
      if (index > 0) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
      }
    }, [dispatch, index]);

    const handleMoveDown = useCallback(() => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
      }
    }, [dispatch, index, totalItems]);

    const handleClose = useCallback(() => {
      dispatch(removeIngredient(ingredient.id));
    }, [dispatch, ingredient.id]);

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  },

  (prevProps, nextProps) =>
    prevProps.ingredient.id === nextProps.ingredient.id &&
    prevProps.index === nextProps.index &&
    prevProps.totalItems === nextProps.totalItems
);

BurgerConstructorElement.displayName = 'BurgerConstructorElement';
