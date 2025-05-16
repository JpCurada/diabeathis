import { useState } from "react";

export interface TrackedFood {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  servingMultiplier: number;
  type: string;
  mealType: string;
  timestamp: string;
}

export interface TrackedExercise {
  id: number;
  name: string;
  caloriesBurned: number;
  duration: number;
  category: string;
  type: string;
  timestamp: string;
}

export type TrackedItem = TrackedFood | TrackedExercise;

export function useTrackedItems() {
  const [items, setItems] = useState<TrackedItem[]>([]);

  const addFood = (food: Omit<TrackedFood, "timestamp">) => {
    setItems([
      ...items,
      {
        ...food,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const addExercise = (exercise: Omit<TrackedExercise, "timestamp">) => {
    setItems([
      ...items,
      {
        ...exercise,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getFoodItems = () =>
    items.filter((item) => item.type === "food") as TrackedFood[];

  const getExerciseItems = () =>
    items.filter((item) => item.type === "exercise") as TrackedExercise[];

  return {
    items,
    addFood,
    addExercise,
    removeItem,
    getFoodItems,
    getExerciseItems,
  };
}
