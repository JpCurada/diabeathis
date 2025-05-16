import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MealTypeSelect } from "@/components/ui/meal-type-select";
import { Card } from "@/components/ui/card";

interface FoodItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

interface FoodDetailsProps {
  food: FoodItem;
  onSave: (details: {
    servingSize: number;
    mealType: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
}

export function FoodDetails({ food, onSave }: FoodDetailsProps) {
  const [servingSize, setServingSize] = useState("1");
  const [mealType, setMealType] = useState("breakfast");
  const [calculatedNutrition, setCalculatedNutrition] = useState({
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
  });

  useEffect(() => {
    const multiplier = Number.parseFloat(servingSize);
    setCalculatedNutrition({
      calories: Math.round(food.calories * multiplier),
      protein: Number.parseFloat((food.protein * multiplier).toFixed(1)),
      carbs: Number.parseFloat((food.carbs * multiplier).toFixed(1)),
      fat: Number.parseFloat((food.fat * multiplier).toFixed(1)),
    });
  }, [servingSize, food]);

  useEffect(() => {
    const handleSaveEvent = () => {
      onSave({
        servingSize: Number.parseFloat(servingSize),
        mealType,
        ...calculatedNutrition,
      });
    };

    document.addEventListener("saveFoodDetails", handleSaveEvent);
    return () => {
      document.removeEventListener("saveFoodDetails", handleSaveEvent);
    };
  }, [servingSize, mealType, calculatedNutrition, onSave]);

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-[#005dff]/5 border-[#005dff]/20">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{food.name}</h3>
            <p className="text-sm text-[#747474]">{food.serving}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{food.calories} cal</p>
            <p className="text-xs text-[#747474]">per serving</p>
          </div>
        </div>
      </Card>

      <MealTypeSelect value={mealType} onChange={setMealType} />

      <div className="space-y-2">
        <Label htmlFor="serving-size">Serving Size</Label>
        <div className="flex items-center gap-2">
          <Input
            id="serving-size"
            type="number"
            min="0.25"
            step="0.25"
            value={servingSize}
            onChange={(e) => setServingSize(e.target.value)}
            className="h-12"
          />
          <span className="text-sm text-[#747474] whitespace-nowrap">
            {food.serving}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center mt-4">
        <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
          <p className="text-xs text-[#747474]">Calories</p>
          <p className="font-semibold">{calculatedNutrition.calories}</p>
        </div>
        <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
          <p className="text-xs text-[#747474]">Protein</p>
          <p className="font-semibold">{calculatedNutrition.protein}g</p>
        </div>
        <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
          <p className="text-xs text-[#747474]">Carbs</p>
          <p className="font-semibold">{calculatedNutrition.carbs}g</p>
        </div>
        <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
          <p className="text-xs text-[#747474]">Fat</p>
          <p className="font-semibold">{calculatedNutrition.fat}g</p>
        </div>
      </div>
    </div>
  );
}
