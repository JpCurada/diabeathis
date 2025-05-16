import { FoodList } from "@/components/track/food-list";

interface FoodTrackingSectionProps {
  items: any[];
}

export function FoodTrackingSection({ items }: FoodTrackingSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Today's Food</h2>
      <FoodList
        items={items.map((item) => ({
          ...item,
          servingMultiplier: item.servingMultiplier || 1,
        }))}
      />
    </div>
  );
}
