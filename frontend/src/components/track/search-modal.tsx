import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FoodSearch } from "@/components/track/food-search";
import { ExerciseSearch } from "@/components/track/exercise-search";

interface SearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTab: "food" | "exercise";
  onSelectFood: (food: any) => void;
  onSelectExercise: (exercise: any) => void;
  foodDatabase: any[];
  exerciseDatabase: any[];
  isMobile: boolean;
}

export function SearchModal({
  isOpen,
  onOpenChange,
  selectedTab,
  onSelectFood,
  onSelectExercise,
  foodDatabase,
  exerciseDatabase,
  isMobile,
}: SearchModalProps) {
  const searchContent = (
    <>
      <div className="px-4 pb-0">
        {selectedTab === "food" ? (
          <FoodSearch foods={foodDatabase} onSelect={onSelectFood} />
        ) : (
          <ExerciseSearch
            exercises={exerciseDatabase}
            onSelect={onSelectExercise}
          />
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>
              Search {selectedTab === "food" ? "Food" : "Exercise"}
            </DrawerTitle>
            <DrawerDescription>
              Find and add {selectedTab === "food" ? "food items" : "exercises"}{" "}
              to track
            </DrawerDescription>
          </DrawerHeader>
          {searchContent}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Search {selectedTab === "food" ? "Food" : "Exercise"}
          </DialogTitle>
          <DialogDescription>
            Find and add {selectedTab === "food" ? "food items" : "exercises"}{" "}
            to track
          </DialogDescription>
        </DialogHeader>
        {searchContent}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
