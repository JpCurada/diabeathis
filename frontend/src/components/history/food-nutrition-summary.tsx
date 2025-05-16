interface FoodNutritionSummaryProps {
  protein: number;
  carbs: number;
  fat: number;
}

export function FoodNutritionSummary({
  protein,
  carbs,
  fat,
}: FoodNutritionSummaryProps) {
  return (
    <div className="mt-3 pt-3 border-t text-sm grid grid-cols-3 text-center">
      <div>
        <p className="text-[#747474]">Protein</p>
        <p className="font-medium">{protein}g</p>
      </div>
      <div>
        <p className="text-[#747474]">Carbs</p>
        <p className="font-medium">{carbs}g</p>
      </div>
      <div>
        <p className="text-[#747474]">Fat</p>
        <p className="font-medium">{fat}g</p>
      </div>
    </div>
  );
}
