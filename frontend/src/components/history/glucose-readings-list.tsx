interface GlucoseReadingsListProps {
  timeRange: string;
  glucoseData: any;
}

export function GlucoseReadingsList({
  timeRange,
  glucoseData,
}: GlucoseReadingsListProps) {
  return (
    <div className="space-y-2">
      {timeRange === "day" &&
        glucoseData.dailyReadings.map((reading: any, index: number) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-[#747474]">{reading.time}</span>
            <span className="text-sm font-medium">
              {reading.value} {glucoseData.unit}
            </span>
          </div>
        ))}

      {timeRange === "week" &&
        glucoseData.weeklyAverages.map((day: any, index: number) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-[#747474]">{day.day}</span>
            <span className="text-sm font-medium">
              {day.value} {glucoseData.unit}
            </span>
          </div>
        ))}

      {timeRange === "month" &&
        glucoseData.monthlyAverages.map((week: any, index: number) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-[#747474]">{week.week}</span>
            <span className="text-sm font-medium">
              {week.value} {glucoseData.unit}
            </span>
          </div>
        ))}

      {timeRange === "year" && (
        <div className="text-center py-4 text-[#747474]">
          <p>Yearly data not available</p>
        </div>
      )}
    </div>
  );
}
