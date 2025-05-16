interface ExerciseActivitiesListProps {
  activities: {
    name: string;
    duration: number;
    caloriesBurned: number;
    distance?: number;
  }[];
}

export function ExerciseActivitiesList({
  activities,
}: ExerciseActivitiesListProps) {
  return (
    <div className="space-y-2">
      {activities.map((activity, activityIndex) => (
        <div key={activityIndex} className="flex justify-between text-sm">
          <div>
            <span className="font-medium">{activity.name}</span>
            <span className="text-[#747474] ml-2">{activity.duration} min</span>
            {activity.distance && (
              <span className="text-[#747474] ml-2">
                {activity.distance} km
              </span>
            )}
          </div>
          <span>{activity.caloriesBurned} cal</span>
        </div>
      ))}
    </div>
  );
}
