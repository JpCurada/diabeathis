import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dumbbell, Utensils } from "lucide-react";
import { Image } from "@/components/ui/image";
import {
  mealRecommendations,
  exerciseRecommendations,
  MealRecommendation,
  ExerciseRecommendation,
} from "@/lib/data";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecommendationCard } from "@/components/recommendations/recommendation-card";
import { MealDetails } from "@/components/recommendations/meal-details";
import { ExerciseDetails } from "@/components/recommendations/exercise-details";

export default function RecommendationsPage() {
  const [selectedTab, setSelectedTab] = useState<"meal" | "exercise">("meal");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    MealRecommendation | ExerciseRecommendation | null
  >(null);

  const handleItemClick = (
    item: MealRecommendation | ExerciseRecommendation
  ) => {
    setSelectedItem(item);
    setOpenDrawer(true);
  };

  return (
    <div className="container px-4 py-6">
      <h1 className="text-2xl font-bold text-[#000000] mb-6">
        Recommendations
      </h1>

      <Tabs
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as "meal" | "exercise")}
        className="w-full mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="meal"
            className="data-[state=active]:bg-[#005dff] data-[state=active]:text-white"
          >
            <Utensils className="h-4 w-4 mr-2" />
            Meal
          </TabsTrigger>
          <TabsTrigger
            value="exercise"
            className="data-[state=active]:bg-[#005dff] data-[state=active]:text-white"
          >
            <Dumbbell className="h-4 w-4 mr-2" />
            Exercise
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {selectedTab === "meal"
          ? mealRecommendations.map((meal: MealRecommendation) => (
              <RecommendationCard
                key={meal.id}
                item={meal}
                type="meal"
                onClick={() => handleItemClick(meal)}
              />
            ))
          : exerciseRecommendations.map((exercise: ExerciseRecommendation) => (
              <RecommendationCard
                key={exercise.id}
                item={exercise}
                type="exercise"
                onClick={() => handleItemClick(exercise)}
              />
            ))}
      </div>

      {selectedItem && (
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{selectedItem.title}</DrawerTitle>
              <DrawerDescription>{selectedItem.description}</DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="h-[60vh] px-4">
              <div className="px-4">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.title}
                  width={300}
                  height={200}
                  className="rounded-md w-full h-48 object-cover mb-4"
                />

                {selectedTab === "meal" ? (
                  <MealDetails meal={selectedItem as MealRecommendation} />
                ) : (
                  <ExerciseDetails
                    exercise={selectedItem as ExerciseRecommendation}
                  />
                )}
              </div>
            </ScrollArea>
            <DrawerFooter className="pt-2">
              <Button className="w-full bg-[#005dff] hover:bg-[#005dff]/90">
                Add to Today's {selectedTab === "meal" ? "Meals" : "Workouts"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
