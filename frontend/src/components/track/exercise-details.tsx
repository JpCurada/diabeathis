import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface ExerciseItem {
  id: number;
  name: string;
  caloriesPerMinute: number;
  category: string;
}

interface ExerciseDetailsProps {
  exercise: ExerciseItem;
  onSave: (details: { duration: number; caloriesBurned: number }) => void;
}

export function ExerciseDetails({ exercise, onSave }: ExerciseDetailsProps) {
  const [duration, setDuration] = useState("30");
  const [caloriesBurned, setCaloriesBurned] = useState(
    exercise.caloriesPerMinute * 30
  );

  useEffect(() => {
    const durationNum = Number.parseInt(duration);
    setCaloriesBurned(exercise.caloriesPerMinute * durationNum);
  }, [duration, exercise]);

  useEffect(() => {
    const handleSaveEvent = () => {
      onSave({
        duration: Number.parseInt(duration),
        caloriesBurned,
      });
    };

    document.addEventListener("saveExerciseDetails", handleSaveEvent);
    return () => {
      document.removeEventListener("saveExerciseDetails", handleSaveEvent);
    };
  }, [duration, caloriesBurned, onSave]);

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-[#005dff]/5 border-[#005dff]/20">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{exercise.name}</h3>
            <p className="text-sm text-[#747474]">{exercise.category}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{exercise.caloriesPerMinute} cal/min</p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <span className="text-sm font-medium">{duration} min</span>
          </div>
          <Slider
            id="duration-slider"
            min={5}
            max={120}
            step={5}
            value={[Number.parseInt(duration)]}
            onValueChange={(value) => setDuration(value[0].toString())}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Custom Duration</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center mt-4">
        <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
          <p className="text-xs text-[#747474]">Calories Burned</p>
          <p className="font-semibold">{caloriesBurned}</p>
        </div>
        <div className="bg-[#d1d1d1]/20 p-3 rounded-md">
          <p className="text-xs text-[#747474]">Category</p>
          <p className="font-semibold">{exercise.category}</p>
        </div>
      </div>
    </div>
  );
}
