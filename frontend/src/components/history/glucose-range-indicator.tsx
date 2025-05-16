interface GlucoseRangeIndicatorProps {
  timeInRange: number;
  timeBelowRange: number;
  timeAboveRange: number;
}

export function GlucoseRangeIndicator({
  timeInRange,
  timeBelowRange,
  timeAboveRange,
}: GlucoseRangeIndicatorProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[#747474]">Below Range</span>
        <span className="text-sm text-[#747474]">In Range</span>
        <span className="text-sm text-[#747474]">Above Range</span>
      </div>
      <div className="w-full h-4 flex rounded-full overflow-hidden">
        <div
          className="bg-[#ff9500] h-full"
          style={{ width: `${timeBelowRange}%` }}
          title={`Below Range: ${timeBelowRange}%`}
        ></div>
        <div
          className="bg-[#34c759] h-full"
          style={{ width: `${timeInRange}%` }}
          title={`In Range: ${timeInRange}%`}
        ></div>
        <div
          className="bg-[#ff3b30] h-full"
          style={{ width: `${timeAboveRange}%` }}
          title={`Above Range: ${timeAboveRange}%`}
        ></div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-medium">{timeBelowRange}%</span>
        <span className="text-sm font-medium">{timeInRange}%</span>
        <span className="text-sm font-medium">{timeAboveRange}%</span>
      </div>
    </>
  );
}
