import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FoodItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

interface FoodSearchProps {
  foods: FoodItem[];
  onSelect: (food: FoodItem) => void;
}

export function FoodSearch({ foods, onSelect }: FoodSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    onSelect(food);
  };

  return (
    <div className="px-4 pb-0">
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search foods..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[40vh] lg:h-[50vh]">
        <div className="space-y-1 pr-4">
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                selectedFood?.id === food.id
                  ? "bg-[#005dff]/10"
                  : "hover:bg-[#d1d1d1]/10"
              }`}
              onClick={() => handleSelectFood(food)}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{food.name}</p>
                  <Badge variant="outline" className="ml-2">
                    {food.calories} cal
                  </Badge>
                </div>
                <p className="text-xs text-[#747474]">
                  {food.serving} | P: {food.protein}g | C: {food.carbs}g | F:{" "}
                  {food.fat}g
                </p>
              </div>
              {selectedFood?.id === food.id && (
                <Check className="h-4 w-4 text-[#005dff] ml-2 flex-shrink-0" />
              )}
            </div>
          ))}
          {filteredFoods.length === 0 && (
            <div className="text-center py-8 text-[#747474] bg-gray-50 rounded-lg">
              <p>No foods found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
