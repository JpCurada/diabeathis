interface ExerciseDetailsProps {
  exercise: {
    duration: string;
    caloriesBurned: number;
    difficulty: string;
    exercises: string[];
  };
}

export function ExerciseDetails({ exercise }: ExerciseDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#d1d1d1]/20 p-2 rounded-md">
          <p className="text-xs text-[#747474]">Duration</p>
          <p className="font-semibold">{exercise.duration}</p>
        </div>
        <div className="bg-[#d1d1d1]/20 p-2 rounded-md">
          <p className="text-xs text-[#747474]">Calories</p>
          <p className="font-semibold">{exercise.caloriesBurned}</p>
        </div>
        <div className="bg-[#d1d1d1]/20 p-2 rounded-md">
          <p className="text-xs text-[#747474]">Difficulty</p>
          <p className="font-semibold">{exercise.difficulty}</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Workout Plan</h3>
        <ul className="list-disc pl-5 space-y-1">
          {exercise.exercises.map((ex, index) => (
            <li key={index} className="text-sm">
              {ex}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
