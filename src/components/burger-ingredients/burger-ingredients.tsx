import { useState, useRef, useEffect, FC, useMemo, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI, Preloader } from '@ui';
import { useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../slices/ingredientsSlices';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);

  const [buns, mains, sauces] = useMemo(
    () => [
      ingredients.filter((item) => item.type === 'bun'),
      ingredients.filter((item) => item.type === 'main'),
      ingredients.filter((item) => item.type === 'sauce')
    ],
    [ingredients]
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0.1
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0.1
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0.1
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = useCallback((tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  }, []);

  if (isLoading) return <Preloader />;

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
