import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Dumbbell,
  Utensils,
  Activity,
  ClipboardList,
} from "lucide-react";
import { glucoseData, foodHistory, exerciseHistory } from "@/lib/data";
import Header from "@/components/header";
import { HistoryTabs } from "@/components/history/history-tabs";
import { HistoryInsights } from "@/components/history/history-insights";
import { ActivityCalendar } from "@/components/history/activity-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [timeRange, setTimeRange] = useState("week");

  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <Header title="History" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-[#005dff] data-[state=active]:text-white"
                >
                  <ClipboardList className="h-4 w-4 mr-2 hidden sm:inline-block" />
                  All Logs
                </TabsTrigger>
                <TabsTrigger
                  value="glucose"
                  className="data-[state=active]:bg-[#005dff] data-[state=active]:text-white"
                >
                  <Activity className="h-4 w-4 mr-2 hidden sm:inline-block" />
                  Glucose
                </TabsTrigger>
                <TabsTrigger
                  value="food"
                  className="data-[state=active]:bg-[#005dff] data-[state=active]:text-white"
                >
                  <Utensils className="h-4 w-4 mr-2 hidden sm:inline-block" />
                  Food
                </TabsTrigger>
                <TabsTrigger
                  value="exercise"
                  className="data-[state=active]:bg-[#005dff] data-[state=active]:text-white"
                >
                  <Dumbbell className="h-4 w-4 mr-2 hidden sm:inline-block" />
                  Exercise
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <HistoryTabs
            selectedTab={selectedTab}
            timeRange={timeRange}
            glucoseData={glucoseData}
            foodHistory={foodHistory}
            exerciseHistory={exerciseHistory}
          />
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityCalendar selectedTab={selectedTab} />
              </CardContent>
            </Card>

            <HistoryInsights
              selectedTab={selectedTab}
              glucoseData={glucoseData}
              foodHistory={foodHistory}
              exerciseHistory={exerciseHistory}
            />
          </div>
        </div>
      </div>

      {/* Mobile insights and calendar */}
      <div className="lg:hidden mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityCalendar selectedTab={selectedTab} isMobile={true} />
          </CardContent>
        </Card>

        <HistoryInsights
          selectedTab={selectedTab}
          glucoseData={glucoseData}
          foodHistory={foodHistory}
          exerciseHistory={exerciseHistory}
          isMobile={true}
        />
      </div>
    </div>
  );
}
