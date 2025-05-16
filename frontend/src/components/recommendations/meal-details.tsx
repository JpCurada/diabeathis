interface MealDetailsProps {
  meal: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: string[];
    instructions: string[];
  };
}

export function MealDetails({ meal }: MealDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-[#d1d1d1]/20 p-2 rounded-md">
          <p className="text-xs text-[#747474]">Calories</p>
          <p className="font-semibold">{meal.calories}</p>
        </div>
        <div className="bg-[#d1d1d1]/20 p-2 rounded-md">
          <p className="text-xs text-[#747474]">Protein</p>
          <p className="font-semibold">{meal.protein}g</p>
        </div>
        <div className="bg-[#d1d1d1]/20 p-2 rounded-md">
          <p className="text-xs text-[#747474]">Carbs</p>
          <p className="font-semibold">{meal.carbs}g</p>
        </div>
        <div className="bg-[#d1d1d1]/20 p-2 rounded-md">
          <p className="text-xs text-[#747474]">Fat</p>
          <p className="font-semibold">{meal.fat}g</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Ingredients</h3>
        <ul className="list-disc pl-5 space-y-1">
          {meal.ingredients.map((ingredient, index) => (
            <li key={index} className="text-sm">
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Instructions</h3>
        <ol className="list-decimal pl-5 space-y-1">
          {meal.instructions.map((instruction, index) => (
            <li key={index} className="text-sm">
              {instruction}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
