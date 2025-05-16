import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExerciseItem {
  id: number;
  name: string;
  caloriesBurned: number;
  duration: number;
  category: string;
  type: string;
  timestamp: string;
}

interface ExerciseListProps {
  items: ExerciseItem[];
}

export function ExerciseList({ items }: ExerciseListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-[#747474] bg-gray-50 rounded-lg border border-gray-100">
        <p>No exercise tracked today</p>
        <p className="text-sm">Click the add button to start tracking</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-350px)] lg:h-[calc(100vh-250px)]">
      <div className="space-y-4 pr-4">
        {items.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="py-3">
              <CardTitle className="text-base flex justify-between">
                <span>{item.name}</span>
                <span>{item.caloriesBurned} cal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-3">
              <div className="text-sm text-[#747474]">
                <p>
                  {item.duration} minutes | {item.category}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
