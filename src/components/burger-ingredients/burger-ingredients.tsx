import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector((state) => state.ingredients.items);
  const constructorItems = useSelector((state) => state.constructorLALALA);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};
    if (!constructorItems) {
      return counters;
    }

    // Для булок всегда показываем 2 (верхняя и нижняя)
    if (constructorItems.bun) {
      counters[constructorItems.bun._id] = 2;
    }

    // Для остальных ингредиентов считаем количество
    if (constructorItems.ingredients) {
      constructorItems.ingredients.forEach((item) => {
        counters[item._id] = (counters[item._id] || 0) + 1;
      });
    }

    return counters;
  }, [constructorItems]);

  const buns = useMemo(
    () =>
      (Array.isArray(ingredients) ? ingredients : []).filter(
        (item: TIngredient) => item.type === 'bun'
      ),
    [ingredients]
  );
  const mains = useMemo(
    () =>
      (Array.isArray(ingredients) ? ingredients : []).filter(
        (item: TIngredient) => item.type === 'main'
      ),
    [ingredients]
  );
  const sauces = useMemo(
    () =>
      (Array.isArray(ingredients) ? ingredients : []).filter(
        (item: TIngredient) => item.type === 'sauce'
      ),
    [ingredients]
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
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

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      ingredientsCounters={ingredientsCounters}
    />
  );
};
