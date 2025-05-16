import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dumbbell, Plus, Utensils } from "lucide-react";
import { foodDatabase, exerciseDatabase } from "@/lib/data";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/header";
import { useIsMobile } from "@/hooks/use-mobile";
import { TrackSummary } from "@/components/track/track-summary";
import { SearchModal } from "@/components/track/search-modal";
import { DetailsModal } from "@/components/track/details-modal";
import { FoodTrackingSection } from "@/components/track/food-tracking-section";
import { ExerciseTrackingSection } from "@/components/track/exercise-tracking-section";

type Food = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
};

type Exercise = {
  id: number;
  name: string;
  caloriesPerMinute: number;
  category: string;
};

type FoodDetailsType = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  mealType: string;
};

type ExerciseDetailsType = {
  duration: number;
  caloriesBurned: number;
};

export default function TrackPage() {
  const [selectedTab, setSelectedTab] = useState<"food" | "exercise">("food");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [trackedFoodItems, setTrackedFoodItems] = useState<
    (Food & {
      type: "food";
      mealType: string;
      timestamp: string;
      servingMultiplier: number;
    })[]
  >([]);

  const [trackedExerciseItems, setTrackedExerciseItems] = useState<
    (Exercise & {
      type: "exercise";
      timestamp: string;
      caloriesBurned: number;
      duration: number;
    })[]
  >([]);
  const [addDetailsOpen, setAddDetailsOpen] = useState(false);
  const [connectStravaOpen, setConnectStravaOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setAddDetailsOpen(true);
    setSearchOpen(false);
  };

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setAddDetailsOpen(true);
    setSearchOpen(false);
  };

  const handleSaveFoodDetails = (details: FoodDetailsType) => {
    if (selectedFood) {
      const newFood = {
        ...selectedFood,
        calories: details.calories,
        protein: details.protein,
        carbs: details.carbs,
        fat: details.fat,
        servingMultiplier: details.servingSize,
        type: "food" as const,
        mealType: details.mealType,
        timestamp: new Date().toISOString(),
      };
      setTrackedFoodItems([...trackedFoodItems, newFood]);
      setSelectedFood(null);
      setAddDetailsOpen(false);
    }
  };

  const handleSaveExerciseDetails = (details: ExerciseDetailsType) => {
    if (selectedExercise) {
      const newExercise = {
        ...selectedExercise,
        duration: details.duration,
        caloriesBurned: details.caloriesBurned,
        type: "exercise" as const,
        timestamp: new Date().toISOString(),
      };
      setTrackedExerciseItems([...trackedExerciseItems, newExercise]);
      setSelectedExercise(null);
      setAddDetailsOpen(false);
    }
  };

  // Calculate nutrition totals for the day
  const totalCalories = trackedFoodItems.reduce(
    (sum, item) => sum + item.calories,
    0
  );
  const totalProtein = trackedFoodItems.reduce(
    (sum, item) => sum + item.protein,
    0
  );
  const totalCarbs = trackedFoodItems.reduce(
    (sum, item) => sum + item.carbs,
    0
  );
  const totalFat = trackedFoodItems.reduce((sum, item) => sum + item.fat, 0);

  // Calculate exercise totals for the day
  const totalCaloriesBurned = trackedExerciseItems.reduce(
    (sum, item) => sum + item.caloriesBurned,
    0
  );
  const totalDuration = trackedExerciseItems.reduce(
    (sum, item) => sum + item.duration,
    0
  );

  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <Header title="Track" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs
            value={selectedTab}
            onValueChange={(value) =>
              setSelectedTab(value as "food" | "exercise")
            }
            className="w-full mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="food"
                className="data-[state=active]:bg-[#005dff] data-[state=active]:text-white"
              >
                <Utensils className="h-4 w-4 mr-2" />
                Food
              </TabsTrigger>
              <TabsTrigger
                value="exercise"
                className="data-[state=active]:bg-[#005dff] data-[state=active]:text-white"
              >
                <Dumbbell className="h-4 w-4 mr-2" />
                Exercise
              </TabsTrigger>
            </TabsList>

            <TabsContent value="food" className="mt-4">
              <div className="mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-[#005dff] hover:bg-[#005dff]/90"
                      onClick={() => setSearchOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Food
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>

              <FoodTrackingSection items={trackedFoodItems} />
            </TabsContent>

            <TabsContent value="exercise" className="mt-4">
              <div className="mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-[#005dff] hover:bg-[#005dff]/90"
                      onClick={() => setSearchOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Exercise
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>

              <ExerciseTrackingSection
                items={trackedExerciseItems}
                connectStravaOpen={connectStravaOpen}
                setConnectStravaOpen={setConnectStravaOpen}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6 space-y-6">
            <TrackSummary
              totalCalories={totalCalories}
              totalProtein={totalProtein}
              totalCarbs={totalCarbs}
              totalFat={totalFat}
              totalCaloriesBurned={totalCaloriesBurned}
              totalDuration={totalDuration}
            />
          </div>
        </div>
      </div>

      {/* Mobile summary card */}
      <div className="lg:hidden mt-6">
        <TrackSummary
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          totalCarbs={totalCarbs}
          totalFat={totalFat}
          totalCaloriesBurned={totalCaloriesBurned}
          totalDuration={totalDuration}
          isMobile={true}
        />
      </div>

      {/* Render modals */}
      <SearchModal
        isOpen={searchOpen}
        onOpenChange={setSearchOpen}
        selectedTab={selectedTab}
        onSelectFood={handleSelectFood}
        onSelectExercise={handleSelectExercise}
        foodDatabase={foodDatabase}
        exerciseDatabase={exerciseDatabase}
        isMobile={isMobile}
      />

      <DetailsModal
        isOpen={addDetailsOpen}
        onOpenChange={setAddDetailsOpen}
        selectedTab={selectedTab}
        selectedFood={selectedFood}
        selectedExercise={selectedExercise}
        onSaveFoodDetails={handleSaveFoodDetails}
        onSaveExerciseDetails={handleSaveExerciseDetails}
        isMobile={isMobile}
      />
    </div>
  );
}
