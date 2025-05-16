import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Activity, Utensils, Dumbbell } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AllLogsSectionProps {
  glucoseData: any;
  foodHistory: any[];
  exerciseHistory: any[];
  timeRange: string;
}

export function AllLogsSection({
  glucoseData,
  foodHistory,
  exerciseHistory,
  timeRange,
}: AllLogsSectionProps) {
  // Create a combined timeline of all events
  const allLogs = createCombinedTimeline(
    glucoseData,
    foodHistory,
    exerciseHistory,
    timeRange
  );

  return (
    <ScrollArea className="h-[calc(100vh-350px)] lg:h-[calc(100vh-250px)]">
      <div className="space-y-4 pr-4">
        {allLogs.length > 0 ? (
          allLogs.map((day, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="py-3">
                <CardTitle className="text-base">
                  {formatDate(day.date)}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0 pb-3">
                <div className="space-y-3">
                  {day.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="border-l-2 pl-3 py-1"
                      style={{ borderColor: getItemColor(item.type) }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          {getItemIcon(item.type)}
                          <div className="ml-2">
                            <div className="flex items-center">
                              <span className="font-medium text-sm">
                                {item.title}
                              </span>
                              <Badge
                                variant="outline"
                                className="ml-2 text-xs"
                                style={{
                                  backgroundColor: `${getItemColor(
                                    item.type
                                  )}10`,
                                  color: getItemColor(item.type),
                                }}
                              >
                                {item.time || formatTime(item.timestamp)}
                              </Badge>
                            </div>
                            <p className="text-sm text-[#747474]">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          {item.value && (
                            <span className="font-medium">
                              {item.value} {item.unit}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-[#747474] bg-gray-50 rounded-lg border border-gray-100">
            <p>No data available for this time period</p>
            <p className="text-sm">Try selecting a different time range</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

// Helper functions
function createCombinedTimeline(
  glucoseData: any,
  foodHistory: any[],
  exerciseHistory: any[],
  timeRange: string
) {
  const timeline: any[] = [];
  const today = new Date();

  // Add glucose readings
  glucoseData.dailyReadings.forEach((reading: any) => {
    // For demo purposes, we'll add these to today
    const date = new Date();
    const [hours, minutes] = reading.time.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);

    const dateString = date.toISOString().split("T")[0];

    let dayEntry = timeline.find((day) => day.date === dateString);
    if (!dayEntry) {
      dayEntry = { date: dateString, items: [] };
      timeline.push(dayEntry);
    }

    dayEntry.items.push({
      type: "glucose",
      time: reading.time,
      title: "Glucose Reading",
      description: `Blood glucose level`,
      value: reading.value,
      unit: glucoseData.unit,
      timestamp: date.toISOString(),
    });
  });

  // Add food entries
  foodHistory.forEach((day) => {
    const dateString = day.date;

    let dayEntry = timeline.find((d) => d.date === dateString);
    if (!dayEntry) {
      dayEntry = { date: dateString, items: [] };
      timeline.push(dayEntry);
    }

    day.meals.forEach((meal) => {
      meal.foods.forEach((food) => {
        // Create a timestamp for sorting (approximate)
        let hours = 8; // Default to morning
        if (meal.type === "Lunch") hours = 12;
        if (meal.type === "Dinner") hours = 18;
        if (meal.type === "Snack") hours = 15;

        const timestamp = new Date(dateString);
        timestamp.setHours(hours, 0, 0, 0);

        dayEntry.items.push({
          type: "food",
          title: `${food.name} (${meal.type})`,
          description: `${food.calories} cal, P: ${food.protein}g, C: ${food.carbs}g, F: ${food.fat}g`,
          timestamp: timestamp.toISOString(),
        });
      });
    });
  });

  // Add exercise entries
  exerciseHistory.forEach((day) => {
    const dateString = day.date;

    let dayEntry = timeline.find((d) => d.date === dateString);
    if (!dayEntry) {
      dayEntry = { date: dateString, items: [] };
      timeline.push(dayEntry);
    }

    day.activities.forEach((activity) => {
      // Create a timestamp for sorting (approximate)
      const timestamp = new Date(dateString);
      timestamp.setHours(10, 0, 0, 0); // Default exercise to morning

      dayEntry.items.push({
        type: "exercise",
        title: activity.name,
        description: `${activity.duration} min, ${activity.caloriesBurned} calories burned`,
        timestamp: timestamp.toISOString(),
      });
    });
  });

  // Filter based on time range
  const filteredTimeline = timeline.filter((day) => {
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

  // Sort days by date (newest first)
  filteredTimeline.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Sort items within each day by timestamp
  filteredTimeline.forEach((day) => {
    day.items.sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  });

  return filteredTimeline;
}

function getItemColor(type: string) {
  switch (type) {
    case "glucose":
      return "#34c759"; // Green
    case "food":
      return "#005dff"; // Blue
    case "exercise":
      return "#9333ea"; // Purple
    default:
      return "#747474"; // Gray
  }
}

function getItemIcon(type: string) {
  switch (type) {
    case "glucose":
      return (
        <Activity className="h-4 w-4" style={{ color: getItemColor(type) }} />
      );
    case "food":
      return (
        <Utensils className="h-4 w-4" style={{ color: getItemColor(type) }} />
      );
    case "exercise":
      return (
        <Dumbbell className="h-4 w-4" style={{ color: getItemColor(type) }} />
      );
    default:
      return null;
  }
}

function formatTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
