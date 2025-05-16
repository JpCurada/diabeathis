import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { foodHistory, exerciseHistory, glucoseData } from "@/lib/data";

interface ActivityCalendarProps {
  selectedTab: string;
  isMobile?: boolean;
}

export function ActivityCalendar({
  selectedTab,
  isMobile = false,
}: ActivityCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  // Generate dates for the last 12 weeks (84 days)
  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();

    // Find the most recent Sunday to start our calendar
    const startDate = new Date(today);
    const daysSinceSunday = startDate.getDay();
    startDate.setDate(startDate.getDate() - daysSinceSunday);

    // Generate 84 days (12 weeks) of data
    for (let i = 0; i < 84; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push({
        date: date.toISOString().split("T")[0],
        value: getActivityValue(date, selectedTab),
        tooltip: getTooltipContent(date, selectedTab),
        dayOfWeek: date.getDay(), // 0 = Sunday, 6 = Saturday
      });
    }

    return dates;
  };

  // Get activity value for a specific date based on selected tab
  const getActivityValue = (date: Date, tab: string) => {
    const dateString = date.toISOString().split("T")[0];

    // For "all" tab, combine values from all categories
    if (tab === "all") {
      let value = 0;

      // Check for food entries
      const foodEntry = foodHistory.find((entry) => entry.date === dateString);
      if (foodEntry) value += 1;

      // Check for exercise entries
      const exerciseEntry = exerciseHistory.find(
        (entry) => entry.date === dateString
      );
      if (exerciseEntry) value += 1;

      // Add a random glucose value (in a real app, this would use actual data)
      const day = date.getDay();
      const dateNum = date.getDate();
      const glucoseValue = (day * 7 + dateNum) % 3;
      value += glucoseValue;

      // Cap at 4
      return Math.min(value, 4);
    } else if (tab === "food") {
      const foodEntry = foodHistory.find((entry) => entry.date === dateString);
      if (foodEntry) {
        // Normalize calories to a 0-4 scale
        const calories = foodEntry.totalCalories;
        if (calories > 1500) return 4;
        if (calories > 1200) return 3;
        if (calories > 900) return 2;
        if (calories > 600) return 1;
        return 0;
      }
    } else if (tab === "exercise") {
      const exerciseEntry = exerciseHistory.find(
        (entry) => entry.date === dateString
      );
      if (exerciseEntry) {
        // Normalize calories burned to a 0-4 scale
        const caloriesBurned = exerciseEntry.totalCaloriesBurned;
        if (caloriesBurned > 500) return 4;
        if (caloriesBurned > 350) return 3;
        if (caloriesBurned > 200) return 2;
        if (caloriesBurned > 100) return 1;
        return 0;
      }
    } else if (tab === "glucose") {
      // For glucose, we'll use a random value based on the date
      // In a real app, this would use actual glucose data
      const day = date.getDay();
      const dateNum = date.getDate();

      // Generate a pseudo-random but consistent value based on date
      const value = (day * 7 + dateNum) % 5;
      return value;
    }

    return 0;
  };

  // Get tooltip content for a specific date
  const getTooltipContent = (date: Date, tab: string) => {
    const dateString = date.toISOString().split("T")[0];
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (tab === "all") {
      const foodEntry = foodHistory.find((entry) => entry.date === dateString);
      const exerciseEntry = exerciseHistory.find(
        (entry) => entry.date === dateString
      );

      const foodInfo = foodEntry
        ? `${foodEntry.totalCalories} calories consumed`
        : "No food data";
      const exerciseInfo = exerciseEntry
        ? `${exerciseEntry.totalCaloriesBurned} calories burned`
        : "No exercise data";

      // For glucose, we'll use a random value based on the date
      const day = date.getDay();
      const dateNum = date.getDate();
      const glucoseValue = 90 + ((day * 7 + dateNum) % 30);
      const glucoseInfo = `Avg. glucose ${glucoseValue} ${glucoseData.unit}`;

      return `${formattedDate}: ${foodInfo}, ${exerciseInfo}, ${glucoseInfo}`;
    } else if (tab === "food") {
      const foodEntry = foodHistory.find((entry) => entry.date === dateString);
      if (foodEntry) {
        return `${formattedDate}: ${foodEntry.totalCalories} calories, ${foodEntry.totalProtein}g protein`;
      }
      return `${formattedDate}: No food data`;
    } else if (tab === "exercise") {
      const exerciseEntry = exerciseHistory.find(
        (entry) => entry.date === dateString
      );
      if (exerciseEntry) {
        return `${formattedDate}: ${exerciseEntry.totalCaloriesBurned} calories burned, ${exerciseEntry.totalDuration} min`;
      }
      return `${formattedDate}: No exercise data`;
    } else if (tab === "glucose") {
      // For glucose, we'll use a random value based on the date
      // In a real app, this would use actual glucose data
      const day = date.getDay();
      const dateNum = date.getDate();

      // Generate a pseudo-random but consistent value based on date
      const value = 90 + ((day * 7 + dateNum) % 30);
      return `${formattedDate}: Avg. glucose ${value} ${glucoseData.unit}`;
    }

    return `${formattedDate}`;
  };

  const calendarDates = generateCalendarDates();

  // Group dates by week
  const weeks = [];
  for (let i = 0; i < calendarDates.length; i += 7) {
    weeks.push(calendarDates.slice(i, i + 7));
  }

  // Get color based on activity level
  const getActivityColor = (value: number, tab: string) => {
    if (value === 0) return "bg-gray-100";

    if (tab === "all") {
      const colors = [
        "bg-gray-100",
        "bg-teal-200",
        "bg-teal-300",
        "bg-teal-400",
        "bg-teal-500",
      ];
      return colors[value];
    } else if (tab === "glucose") {
      const colors = [
        "bg-green-100",
        "bg-green-200",
        "bg-green-300",
        "bg-green-400",
        "bg-green-500",
      ];
      return colors[value];
    } else if (tab === "food") {
      const colors = [
        "bg-blue-100",
        "bg-blue-200",
        "bg-blue-300",
        "bg-blue-400",
        "bg-blue-500",
      ];
      return colors[value];
    } else if (tab === "exercise") {
      const colors = [
        "bg-purple-100",
        "bg-purple-200",
        "bg-purple-300",
        "bg-purple-400",
        "bg-purple-500",
      ];
      return colors[value];
    }

    return "bg-gray-100";
  };

  return (
    <div>
      <div className="mb-2 flex justify-between items-center">
        <div className="text-sm text-[#747474]">
          {selectedTab === "all"
            ? "All Activity"
            : selectedTab === "glucose"
            ? "Glucose Levels"
            : selectedTab === "food"
            ? "Nutrition Tracking"
            : "Exercise Activity"}
        </div>
        <div className="flex items-center gap-1">
          <div className="text-xs text-[#747474]">Less</div>
          <div className="flex gap-0.5">
            <div className={`w-2.5 h-2.5 rounded-sm bg-gray-100`}></div>
            <div
              className={`w-2.5 h-2.5 rounded-sm ${
                selectedTab === "all"
                  ? "bg-teal-200"
                  : selectedTab === "glucose"
                  ? "bg-green-200"
                  : selectedTab === "food"
                  ? "bg-blue-200"
                  : "bg-purple-200"
              }`}
            ></div>
            <div
              className={`w-2.5 h-2.5 rounded-sm ${
                selectedTab === "all"
                  ? "bg-teal-300"
                  : selectedTab === "glucose"
                  ? "bg-green-300"
                  : selectedTab === "food"
                  ? "bg-blue-300"
                  : "bg-purple-300"
              }`}
            ></div>
            <div
              className={`w-2.5 h-2.5 rounded-sm ${
                selectedTab === "all"
                  ? "bg-teal-500"
                  : selectedTab === "glucose"
                  ? "bg-green-500"
                  : selectedTab === "food"
                  ? "bg-blue-500"
                  : "bg-purple-500"
              }`}
            ></div>
          </div>
          <div className="text-xs text-[#747474]">More</div>
        </div>
      </div>

      <TooltipProvider>
        <div
          className={`grid ${
            isMobile ? "grid-cols-7 gap-1" : "grid-cols-7 gap-1"
          }`}
        >
          {/* Days of week labels */}
          {!isMobile && (
            <>
              <div className="text-xs text-[#747474] h-5 flex items-center justify-center">
                S
              </div>
              <div className="text-xs text-[#747474] h-5 flex items-center justify-center">
                M
              </div>
              <div className="text-xs text-[#747474] h-5 flex items-center justify-center">
                T
              </div>
              <div className="text-xs text-[#747474] h-5 flex items-center justify-center">
                W
              </div>
              <div className="text-xs text-[#747474] h-5 flex items-center justify-center">
                T
              </div>
              <div className="text-xs text-[#747474] h-5 flex items-center justify-center">
                F
              </div>
              <div className="text-xs text-[#747474] h-5 flex items-center justify-center">
                S
              </div>
            </>
          )}

          {/* Calendar grid */}
          {calendarDates.map((day, dayIndex) => (
            <Tooltip key={dayIndex}>
              <TooltipTrigger asChild>
                <div
                  className={`${getActivityColor(
                    day.value,
                    selectedTab
                  )} w-full aspect-square rounded-sm cursor-pointer transition-colors hover:opacity-80`}
                  onMouseEnter={() => setHoveredDay(day.date)}
                  onMouseLeave={() => setHoveredDay(null)}
                ></div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{day.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {hoveredDay && (
        <div className="mt-2 text-xs text-[#747474]">
          {calendarDates.find((d) => d.date === hoveredDay)?.tooltip}
        </div>
      )}
    </div>
  );
}
