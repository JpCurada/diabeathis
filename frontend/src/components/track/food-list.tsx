import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FoodItem {
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

interface FoodListProps {
  items: FoodItem[];
}

export function FoodList({ items }: FoodListProps) {
  // Group food items by meal type
  const foodByMeal = items.reduce((acc, item) => {
    const mealType = item.mealType || "other";
    if (!acc[mealType]) acc[mealType] = [];
    acc[mealType].push(item);
    return acc;
  }, {} as Record<string, FoodItem[]>);

  const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

  if (Object.keys(foodByMeal).length === 0) {
    return (
      <div className="text-center py-8 text-[#747474] bg-gray-50 rounded-lg border border-gray-100">
        <p>No food tracked today</p>
        <p className="text-sm">Click the add button to start tracking</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-350px)] lg:h-[calc(100vh-250px)]">
      <div className="space-y-6 pr-4">
        {mealTypes.map(
          (type) =>
            foodByMeal[type] &&
            foodByMeal[type].length > 0 && (
              <div key={type} className="space-y-2">
                <h3 className="text-md font-medium capitalize">{type}</h3>
                {foodByMeal[type].map((item, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex justify-between">
                        <span>{item.name}</span>
                        <span>{item.calories} cal</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                      <div className="text-sm text-[#747474]">
                        <p>
                          {item.servingMultiplier} {item.serving} | P:{" "}
                          {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
        )}
      </div>
    </ScrollArea>
  );
}
