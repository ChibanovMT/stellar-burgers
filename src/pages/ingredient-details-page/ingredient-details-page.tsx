import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../../components/ui/preloader';
import { IngredientDetailsUI } from '../../components/ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/ingredientsSlice';

export const IngredientDetailsPage: FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector((state) => state.ingredients.items);
  const isLoading = useSelector((state) => state.ingredients.isLoading);

  useEffect(() => {
    if (ingredients.length === 0 && !isLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, isLoading]);

  const ingredientData = ingredients.find((item) => item._id === id);

  if (isLoading || ingredients.length === 0) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
