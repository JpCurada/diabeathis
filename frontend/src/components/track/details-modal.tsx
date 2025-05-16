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
import { FoodDetails } from "@/components/track/food-details";
import { ExerciseDetails } from "@/components/track/exercise-details";

interface DetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTab: "food" | "exercise";
  selectedFood: any;
  selectedExercise: any;
  onSaveFoodDetails: (details: any) => void;
  onSaveExerciseDetails: (details: any) => void;
  isMobile: boolean;
}

export function DetailsModal({
  isOpen,
  onOpenChange,
  selectedTab,
  selectedFood,
  selectedExercise,
  onSaveFoodDetails,
  onSaveExerciseDetails,
  isMobile,
}: DetailsModalProps) {
  const detailsContent = (
    <div className="px-4">
      {selectedTab === "food" && selectedFood ? (
        <FoodDetails food={selectedFood} onSave={onSaveFoodDetails} />
      ) : selectedTab === "exercise" && selectedExercise ? (
        <ExerciseDetails
          exercise={selectedExercise}
          onSave={onSaveExerciseDetails}
        />
      ) : null}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>
              Add{" "}
              {selectedTab === "food"
                ? selectedFood?.name
                : selectedExercise?.name}
            </DrawerTitle>
            <DrawerDescription>
              Enter details to track this {selectedTab}
            </DrawerDescription>
          </DrawerHeader>
          {detailsContent}
          <DrawerFooter>
            <Button
              className="bg-[#005dff] hover:bg-[#005dff]/90"
              onClick={() => {
                if (selectedTab === "food" && selectedFood) {
                  document.dispatchEvent(new Event("saveFoodDetails"));
                } else if (selectedTab === "exercise" && selectedExercise) {
                  document.dispatchEvent(new Event("saveExerciseDetails"));
                }
              }}
            >
              Add to Tracker
            </Button>
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
            Add{" "}
            {selectedTab === "food"
              ? selectedFood?.name
              : selectedExercise?.name}
          </DialogTitle>
          <DialogDescription>
            Enter details to track this {selectedTab}
          </DialogDescription>
        </DialogHeader>
        {detailsContent}
        <DialogFooter>
          <Button
            className="bg-[#005dff] hover:bg-[#005dff]/90"
            onClick={() => {
              if (selectedTab === "food" && selectedFood) {
                document.dispatchEvent(new Event("saveFoodDetails"));
              } else if (selectedTab === "exercise" && selectedExercise) {
                document.dispatchEvent(new Event("saveExerciseDetails"));
              }
            }}
          >
            Add to Tracker
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
