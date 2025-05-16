import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrackSummaryProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalCaloriesBurned: number;
  totalDuration: number;
  isMobile?: boolean;
}

export function TrackSummary({
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  totalCaloriesBurned,
  totalDuration,
  isMobile = false,
}: TrackSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Nutrition
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
                <p className="text-xs text-[#747474]">Calories</p>
                <p className="font-semibold">{totalCalories}</p>
              </div>
              <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
                <p className="text-xs text-[#747474]">Protein</p>
                <p className="font-semibold">{totalProtein.toFixed(1)}g</p>
              </div>
              <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
                <p className="text-xs text-[#747474]">Carbs</p>
                <p className="font-semibold">{totalCarbs.toFixed(1)}g</p>
              </div>
              <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
                <p className="text-xs text-[#747474]">Fat</p>
                <p className="font-semibold">{totalFat.toFixed(1)}g</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Exercise</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
                <p className="text-xs text-[#747474]">Calories Burned</p>
                <p className="font-semibold">{totalCaloriesBurned}</p>
              </div>
              <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
                <p className="text-xs text-[#747474]">Duration</p>
                <p className="font-semibold">{totalDuration} min</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Net Calories
            </h3>
            <div className="bg-[#005dff]/10 p-3 rounded-md">
              <p className="text-xs text-[#747474]">
                Calories In - Calories Out
              </p>
              <p className="font-semibold text-[#005dff]">
                {totalCalories - totalCaloriesBurned}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
