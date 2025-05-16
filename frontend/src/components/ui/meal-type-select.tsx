import { Label } from "@/components/ui/label";
import { Coffee, UtensilsCrossed, Salad, Cookie } from "lucide-react";

interface MealTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function MealTypeSelect({ value, onChange }: MealTypeSelectProps) {
  const mealTypes = [
    { id: "breakfast", label: "Breakfast", icon: Coffee },
    { id: "lunch", label: "Lunch", icon: UtensilsCrossed },
    { id: "dinner", label: "Dinner", icon: Salad },
    { id: "snack", label: "Snack", icon: Cookie },
  ];

  return (
    <div className="space-y-2">
      <Label>Meal Type</Label>
      <div className="grid grid-cols-4 gap-2">
        {mealTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-md border transition-colors ${
                value === type.id
                  ? "bg-[#005dff]/10 border-[#005dff] text-[#005dff]"
                  : "border-[#d1d1d1] hover:border-[#005dff]/50"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
