import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  initialState,
  type ConstructorState
} from './constructorSlice';

const makeIngredient = (overrides: Partial<any> = {}) =>
  ({
    id: 'id',
    _id: 'backend-id',
    name: 'Ингредиент',
    type: 'main',
    price: 10,
    image: 'img',
    ...overrides
  }) as any;

describe('constructorSlice', () => {
  it('должен возвращать начальное состояние по умолчанию', () => {
    const state = constructorReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('должен добавлять булку отдельно от начинки', () => {
    const bun = makeIngredient({ id: 'bun1', type: 'bun' });
    const state = constructorReducer(initialState, addIngredient(bun));

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен добавлять начинку в список ингредиентов', () => {
    const ingredient = makeIngredient({ id: 'ing1', type: 'main' });
    const state = constructorReducer(initialState, addIngredient(ingredient));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([ingredient]);
  });

  it('должен удалять ингредиент по id', () => {
    const ingredient1 = makeIngredient({ id: '1' });
    const ingredient2 = makeIngredient({ id: '2' });
    const prevState: ConstructorState = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };

    const state = constructorReducer(prevState, removeIngredient('1'));

    expect(state.ingredients).toEqual([ingredient2]);
  });

  it('должен менять местами ингредиенты при moveIngredient', () => {
    const ingredient1 = makeIngredient({ id: '1' });
    const ingredient2 = makeIngredient({ id: '2' });
    const prevState: ConstructorState = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };

    const state = constructorReducer(
      prevState,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(state.ingredients[0]).toEqual(ingredient2);
    expect(state.ingredients[1]).toEqual(ingredient1);
  });

  it('должен перемещать ингредиент вверх при moveIngredientUp', () => {
    const ingredient1 = makeIngredient({ id: '1' });
    const ingredient2 = makeIngredient({ id: '2' });
    const prevState: ConstructorState = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };

    const state = constructorReducer(prevState, moveIngredientUp('2'));

    expect(state.ingredients[0]).toEqual(ingredient2);
    expect(state.ingredients[1]).toEqual(ingredient1);
  });

  it('должен перемещать ингредиент вниз при moveIngredientDown', () => {
    const ingredient1 = makeIngredient({ id: '1' });
    const ingredient2 = makeIngredient({ id: '2' });
    const prevState: ConstructorState = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };

    const state = constructorReducer(prevState, moveIngredientDown('1'));

    expect(state.ingredients[0]).toEqual(ingredient2);
    expect(state.ingredients[1]).toEqual(ingredient1);
  });

  it('должен очищать конструктор при clearConstructor', () => {
    const prevState: ConstructorState = {
      bun: makeIngredient({ id: 'bun1', type: 'bun' }),
      ingredients: [makeIngredient({ id: '1' })]
    };

    const state = constructorReducer(prevState, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
