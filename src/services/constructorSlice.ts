import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

export type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        state.ingredients.push(ingredient);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragItem = state.ingredients[dragIndex];
      if (dragItem) {
        state.ingredients.splice(dragIndex, 1);
        state.ingredients.splice(hoverIndex, 0, dragItem);
      }
    },
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const currentIndex = state.ingredients.findIndex(
        (item) => item.id === id
      );
      if (currentIndex > 0) {
        const item = state.ingredients[currentIndex];
        state.ingredients.splice(currentIndex, 1);
        state.ingredients.splice(currentIndex - 1, 0, item);
      }
    },
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const currentIndex = state.ingredients.findIndex(
        (item) => item.id === id
      );
      if (currentIndex < state.ingredients.length - 1) {
        const item = state.ingredients[currentIndex];
        state.ingredients.splice(currentIndex, 1);
        state.ingredients.splice(currentIndex + 1, 0, item);
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
