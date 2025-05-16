interface FoodMealsListProps {
  meals: {
    type: string;
    foods: {
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      serving: string;
    }[];
  }[];
}

export function FoodMealsList({ meals }: FoodMealsListProps) {
  return (
    <div className="space-y-3">
      {meals.map((meal, mealIndex) => (
        <div key={mealIndex}>
          <p className="font-medium text-sm">{meal.type}</p>
          <div className="pl-3 border-l-2 border-[#d1d1d1] mt-1 space-y-1">
            {meal.foods.map((food, foodIndex) => (
              <div key={foodIndex} className="text-sm flex justify-between">
                <span>{food.name}</span>
                <span>{food.calories} cal</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
