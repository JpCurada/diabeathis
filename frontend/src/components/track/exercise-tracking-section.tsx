import { ExerciseList } from "@/components/track/exercise-list";
import { StravaConnect } from "@/components/track/strava-connect";

interface ExerciseTrackingSectionProps {
  items: any[];
  connectStravaOpen: boolean;
  setConnectStravaOpen: (open: boolean) => void;
}

export function ExerciseTrackingSection({
  items,
  connectStravaOpen,
  setConnectStravaOpen,
}: ExerciseTrackingSectionProps) {
  return (
    <>
      <div className="mb-4">
        <StravaConnect
          isOpen={connectStravaOpen}
          onOpenChange={setConnectStravaOpen}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Today's Exercise</h2>
        <ExerciseList
          items={items.map((item) => ({
            ...item,
            caloriesBurned: item.caloriesBurned || 0,
            duration: item.duration || 0,
          }))}
        />
      </div>
    </>
  );
}
