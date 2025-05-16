import { Tabs, TabsContent } from "@/components/ui/tabs";
import { GlucoseSection } from "@/components/history/glucose-section";
import { FoodHistoryList } from "@/components/history/food-history-list";
import { ExerciseHistoryList } from "@/components/history/exercise-history-list";
import { AllLogsSection } from "@/components/history/all-logs-section";

interface HistoryTabsProps {
  selectedTab: string;
  timeRange: string;
  glucoseData: any;
  foodHistory: any[];
  exerciseHistory: any[];
}

export function HistoryTabs({
  selectedTab,
  timeRange,
  glucoseData,
  foodHistory,
  exerciseHistory,
}: HistoryTabsProps) {
  return (
    <Tabs value={selectedTab}>
      <TabsContent value="all" className="mt-0">
        <AllLogsSection
          glucoseData={glucoseData}
          foodHistory={foodHistory}
          exerciseHistory={exerciseHistory}
          timeRange={timeRange}
        />
      </TabsContent>

      <TabsContent value="glucose" className="mt-0">
        <GlucoseSection glucoseData={glucoseData} timeRange={timeRange} />
      </TabsContent>

      <TabsContent value="food" className="mt-0">
        <FoodHistoryList foodHistory={foodHistory} timeRange={timeRange} />
      </TabsContent>

      <TabsContent value="exercise" className="mt-0">
        <ExerciseHistoryList
          exerciseHistory={exerciseHistory}
          timeRange={timeRange}
        />
      </TabsContent>
    </Tabs>
  );
}
