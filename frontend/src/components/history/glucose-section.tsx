import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlucoseReadingsList } from "@/components/history/glucose-readings-list";
import { GlucoseRangeIndicator } from "@/components/history/glucose-range-indicator";

type GlucoseData = {
  current: number;
  unit: string;
  trend: "rising" | "rising_rapidly" | "falling" | "falling_rapidly" | "stable";
  timeInRange: number;
  gmi: number;
  timeAboveRange: number;
  timeBelowRange: number;
  variability: number;
  dailyReadings: { time: string; value: number }[];
  weeklyAverages: { day: string; value: number }[];
  monthlyAverages: { week: string; value: number }[];
};

interface GlucoseSectionProps {
  glucoseData: GlucoseData;
  timeRange: string;
}

export function GlucoseSection({
  glucoseData,
  timeRange,
}: GlucoseSectionProps) {
  const [connectCGMOpen, setConnectCGMOpen] = useState(false);

  return (
    <ScrollArea className="h-[calc(100vh-350px)] lg:h-[calc(100vh-250px)]">
      <div className="space-y-6 pr-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Glucose</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{glucoseData.current}</span>
              <span className="text-lg mb-1">{glucoseData.unit}</span>
              {renderTrendArrow(glucoseData.trend)}
            </div>
            <p className="text-sm text-[#747474] mt-1">Updated just now</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Time in Range</CardTitle>
          </CardHeader>
          <CardContent>
            <GlucoseRangeIndicator
              timeInRange={glucoseData.timeInRange}
              timeBelowRange={glucoseData.timeBelowRange}
              timeAboveRange={glucoseData.timeAboveRange}
            />
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {timeRange === "day"
                ? "Today's Readings"
                : timeRange === "week"
                ? "Weekly Averages"
                : timeRange === "month"
                ? "Monthly Averages"
                : "Yearly Averages"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GlucoseReadingsList
              timeRange={timeRange}
              glucoseData={glucoseData}
            />
          </CardContent>
        </Card>

        <div className="mt-4">
          <Dialog open={connectCGMOpen} onOpenChange={setConnectCGMOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Connect CGM Device
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect CGM Device</DialogTitle>
                <DialogDescription>
                  Link your Continuous Glucose Monitor to track your glucose
                  levels in real-time
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-[#d1d1d1]/10">
                  <div>
                    <p className="font-medium">Dexcom G6</p>
                    <p className="text-xs text-[#747474]">
                      Connect your Dexcom G6 CGM
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-[#d1d1d1]/10">
                  <div>
                    <p className="font-medium">FreeStyle Libre</p>
                    <p className="text-xs text-[#747474]">
                      Connect your FreeStyle Libre CGM
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-[#d1d1d1]/10">
                  <div>
                    <p className="font-medium">Medtronic Guardian</p>
                    <p className="text-xs text-[#747474]">
                      Connect your Medtronic Guardian CGM
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setConnectCGMOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ScrollArea>
  );
}

function renderTrendArrow(trend: GlucoseData["trend"]) {
  switch (trend) {
    case "rising":
      return <ArrowUp className="h-5 w-5 text-[#ff9500] mb-1" />;
    case "rising_rapidly":
      return (
        <div className="flex flex-col mb-1">
          <ArrowUp className="h-5 w-5 text-[#ff3b30]" />
          <ArrowUp className="h-5 w-5 text-[#ff3b30] -mt-3" />
        </div>
      );
    case "falling":
      return <ArrowDown className="h-5 w-5 text-[#ff9500] mb-1" />;
    case "falling_rapidly":
      return (
        <div className="flex flex-col mb-1">
          <ArrowDown className="h-5 w-5 text-[#ff3b30]" />
          <ArrowDown className="h-5 w-5 text-[#ff3b30] -mt-3" />
        </div>
      );
    case "stable":
    default:
      return <ArrowRight className="h-5 w-5 text-[#34c759] mb-1" />;
  }
}
