import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExerciseItem {
  id: number;
  name: string;
  caloriesPerMinute: number;
  category: string;
}

interface ExerciseSearchProps {
  exercises: ExerciseItem[];
  onSelect: (exercise: ExerciseItem) => void;
}

export function ExerciseSearch({ exercises, onSelect }: ExerciseSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(
    null
  );

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectExercise = (exercise: ExerciseItem) => {
    setSelectedExercise(exercise);
    onSelect(exercise);
  };

  return (
    <div className="px-4 pb-0">
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[40vh] lg:h-[50vh]">
        <div className="space-y-1 pr-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                selectedExercise?.id === exercise.id
                  ? "bg-[#005dff]/10"
                  : "hover:bg-[#d1d1d1]/10"
              }`}
              onClick={() => handleSelectExercise(exercise)}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{exercise.name}</p>
                  <Badge variant="outline" className="ml-2">
                    {exercise.category}
                  </Badge>
                </div>
                <p className="text-xs text-[#747474]">
                  {exercise.caloriesPerMinute} cal/min
                </p>
              </div>
              {selectedExercise?.id === exercise.id && (
                <Check className="h-4 w-4 text-[#005dff] ml-2 flex-shrink-0" />
              )}
            </div>
          ))}
          {filteredExercises.length === 0 && (
            <div className="text-center py-8 text-[#747474] bg-gray-50 rounded-lg">
              <p>No exercises found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
