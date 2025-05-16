import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, LineChart } from "lucide-react";

interface HistoryInsightsProps {
  selectedTab: string;
  glucoseData: any;
  foodHistory: any[];
  exerciseHistory: any[];
  isMobile?: boolean;
}

export function HistoryInsights({
  selectedTab,
  glucoseData,
  foodHistory,
  exerciseHistory,
  isMobile = false,
}: HistoryInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renderInsightsByTab(
            selectedTab,
            glucoseData,
            foodHistory,
            exerciseHistory,
            isMobile
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function renderInsightsByTab(
  selectedTab: string,
  glucoseData: any,
  foodHistory: any[],
  exerciseHistory: any[],
  isMobile: boolean
) {
  // For "all" tab, show a summary of each category

  if (selectedTab === "all") {
    return (
      <>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Summary</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
              <p className="text-xs text-[#747474]">Glucose Avg</p>
              <p className="font-semibold">
                {Math.round(
                  glucoseData.weeklyAverages.reduce(
                    (sum: number, day: any) => sum + day.value,
                    0
                  ) / glucoseData.weeklyAverages.length
                )}{" "}
                {glucoseData.unit}
              </p>
            </div>
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
              <p className="text-xs text-[#747474]">Time in Range</p>
              <p className="font-semibold">{glucoseData.timeInRange}%</p>
            </div>
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
              <p className="text-xs text-[#747474]">Avg Calories</p>
              <p className="font-semibold">
                {Math.round(
                  foodHistory.reduce((sum, day) => sum + day.totalCalories, 0) /
                    foodHistory.length
                )}
              </p>
            </div>
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
              <p className="text-xs text-[#747474]">Calories Burned</p>
              <p className="font-semibold">
                {Math.round(
                  exerciseHistory.reduce(
                    (sum, day) => sum + day.totalCaloriesBurned,
                    0
                  ) / exerciseHistory.length
                )}
              </p>
            </div>
          </div>
        </div>

        {!isMobile && (
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Recent Activity
            </h3>
            <div className="space-y-2">
              {foodHistory.length > 0 && (
                <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-100 rounded-md">
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-700 mr-2"
                    >
                      Food
                    </Badge>
                    <span className="text-sm">
                      Last meal: {foodHistory[0].meals[0].foods[0].name}
                    </span>
                  </div>
                </div>
              )}

              {exerciseHistory.length > 0 && (
                <div className="flex items-center justify-between p-2 bg-purple-50 border border-purple-100 rounded-md">
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-700 mr-2"
                    >
                      Exercise
                    </Badge>
                    <span className="text-sm">
                      Last activity: {exerciseHistory[0].activities[0].name}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded-md">
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 mr-2"
                  >
                    Glucose
                  </Badge>
                  <span className="text-sm">
                    Current: {glucoseData.current} {glucoseData.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Glucose insights
  if (selectedTab === "glucose") {
    return (
      <>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Glucose Metrics
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
              <p className="text-xs text-[#747474]">Time in Range</p>
              <p className="font-semibold">{glucoseData.timeInRange}%</p>
            </div>
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
              <p className="text-xs text-[#747474]">GMI</p>
              <p className="font-semibold">{glucoseData.gmi}%</p>
            </div>
            {!isMobile && (
              <>
                <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
                  <p className="text-xs text-[#747474]">Variability</p>
                  <p className="font-semibold">{glucoseData.variability}%</p>
                </div>
                <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
                  <p className="text-xs text-[#747474]">Average</p>
                  <p className="font-semibold">
                    {Math.round(
                      glucoseData.weeklyAverages.reduce(
                        (sum: number, day: any) => sum + day.value,
                        0
                      ) / glucoseData.weeklyAverages.length
                    )}{" "}
                    {glucoseData.unit}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {!isMobile && (
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Daily Readings
            </h3>
            <div className="space-y-2">
              {glucoseData.dailyReadings.map((reading: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-[#747474]">{reading.time}</span>
                  <span className="font-medium">
                    {reading.value} {glucoseData.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isMobile && (
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Patterns</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-100 rounded-md">
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-700 mr-2"
                  >
                    Morning
                  </Badge>
                  <span className="text-sm">High glucose pattern</span>
                </div>
                <LineChart className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded-md">
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 mr-2"
                  >
                    Afternoon
                  </Badge>
                  <span className="text-sm">Stable pattern</span>
                </div>
                <LineChart className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Food insights
  if (selectedTab === "food") {
    return (
      <>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Nutrition Summary
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
              <p className="text-xs text-[#747474]">Avg. Calories</p>
              <p className="font-semibold">
                {Math.round(
                  foodHistory.reduce((sum, day) => sum + day.totalCalories, 0) /
                    foodHistory.length
                )}
              </p>
            </div>
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
              <p className="text-xs text-[#747474]">Avg. Protein</p>
              <p className="font-semibold">
                {Math.round(
                  foodHistory.reduce((sum, day) => sum + day.totalProtein, 0) /
                    foodHistory.length
                )}
                g
              </p>
            </div>
            {!isMobile && (
              <>
                <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
                  <p className="text-xs text-[#747474]">Avg. Carbs</p>
                  <p className="font-semibold">
                    {Math.round(
                      foodHistory.reduce(
                        (sum, day) => sum + day.totalCarbs,
                        0
                      ) / foodHistory.length
                    )}
                    g
                  </p>
                </div>
                <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
                  <p className="text-xs text-[#747474]">Avg. Fat</p>
                  <p className="font-semibold">
                    {Math.round(
                      foodHistory.reduce((sum, day) => sum + day.totalFat, 0) /
                        foodHistory.length
                    )}
                    g
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {!isMobile && (
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Meal Distribution
            </h3>
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs">Breakfast</span>
                <span className="text-xs font-medium">28%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-[#005dff] h-1.5 rounded-full"
                  style={{ width: "28%" }}
                ></div>
              </div>
            </div>
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs">Lunch</span>
                <span className="text-xs font-medium">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-[#005dff] h-1.5 rounded-full"
                  style={{ width: "35%" }}
                ></div>
              </div>
            </div>
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs">Dinner</span>
                <span className="text-xs font-medium">32%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-[#005dff] h-1.5 rounded-full"
                  style={{ width: "32%" }}
                ></div>
              </div>
            </div>
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs">Snacks</span>
                <span className="text-xs font-medium">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-[#005dff] h-1.5 rounded-full"
                  style={{ width: "5%" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Exercise insights
  if (selectedTab === "exercise") {
    return (
      <>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Exercise Summary
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
              <p className="text-xs text-[#747474]">Avg. Calories</p>
              <p className="font-semibold">
                {Math.round(
                  exerciseHistory.reduce(
                    (sum, day) => sum + day.totalCaloriesBurned,
                    0
                  ) / exerciseHistory.length
                )}
              </p>
            </div>
            <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
              <p className="text-xs text-[#747474]">Avg. Duration</p>
              <p className="font-semibold">
                {Math.round(
                  exerciseHistory.reduce(
                    (sum, day) => sum + day.totalDuration,
                    0
                  ) / exerciseHistory.length
                )}{" "}
                min
              </p>
            </div>
            {!isMobile && (
              <>
                <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
                  <p className="text-xs text-[#747474]">Active Days</p>
                  <p className="font-semibold">{exerciseHistory.length} days</p>
                </div>
                <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
                  <p className="text-xs text-[#747474]">Total Activities</p>
                  <p className="font-semibold">
                    {exerciseHistory.reduce(
                      (sum, day) => sum + day.activities.length,
                      0
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {!isMobile && (
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Activity Types
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-100 rounded-md">
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-700 mr-2"
                  >
                    Cardio
                  </Badge>
                  <span className="text-sm">65% of activities</span>
                </div>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 border border-purple-100 rounded-md">
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-700 mr-2"
                  >
                    Strength
                  </Badge>
                  <span className="text-sm">25% of activities</span>
                </div>
                <BarChart3 className="h-4 w-4 text-purple-500" />
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded-md">
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 mr-2"
                  >
                    Flexibility
                  </Badge>
                  <span className="text-sm">10% of activities</span>
                </div>
                <BarChart3 className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
