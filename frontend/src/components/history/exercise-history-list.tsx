import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ExerciseActivitiesList } from "@/components/history/exercise-activities-list";

type ExerciseHistoryDay = {
  date: string;
  totalCaloriesBurned: number;
  totalDuration: number;
  activities: {
    name: string;
    duration: number;
    caloriesBurned: number;
    distance?: number;
  }[];
};

interface ExerciseHistoryListProps {
  exerciseHistory: ExerciseHistoryDay[];
  timeRange: string;
}

export function ExerciseHistoryList({
  exerciseHistory,
  timeRange,
}: ExerciseHistoryListProps) {
  // Filter exercise history based on time range
  const filteredHistory = filterHistoryByTimeRange(exerciseHistory, timeRange);

  return (
    <ScrollArea className="h-[calc(100vh-350px)] lg:h-[calc(100vh-250px)]">
      <div className="space-y-4 pr-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((day: ExerciseHistoryDay, index: number) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="py-3">
                <CardTitle className="text-base flex justify-between items-center">
                  <span>{formatDate(day.date)}</span>
                  <Badge
                    variant="outline"
                    className="ml-2 bg-[#005dff]/10 text-[#005dff]"
                  >
                    {day.totalCaloriesBurned} cal
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0 pb-3">
                <ExerciseActivitiesList activities={day.activities} />
                <div className="mt-3 pt-3 border-t text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#747474]">Total Duration</span>
                    <span className="font-medium">{day.totalDuration} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-[#747474] bg-gray-50 rounded-lg border border-gray-100">
            <p>No exercise data available for this time period</p>
            <p className="text-sm">Try selecting a different time range</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

function filterHistoryByTimeRange(
  history: ExerciseHistoryDay[],
  timeRange: string
) {
  const today = new Date();

  return history.filter((day) => {
    const date = new Date(day.date);

    if (timeRange === "day") {
      return date.toDateString() === today.toDateString();
    } else if (timeRange === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      return date >= weekAgo;
    } else if (timeRange === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      return date >= monthAgo;
    }

    return true; // For "year" or any other value, show all
  });
}
