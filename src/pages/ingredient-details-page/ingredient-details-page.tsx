import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../../components/ui/preloader';
import { IngredientDetailsUI } from '../../components/ui/ingredient-details';
import { useSelector } from '../../services/store';

export const IngredientDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector((state) => state.ingredients.items);
  const isLoading = useSelector((state) => state.ingredients.isLoading);

  const ingredientData = ingredients.find((item) => item._id === id);

  if (isLoading || ingredients.length === 0) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
