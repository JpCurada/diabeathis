import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Watch } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PhysicalHealthFormProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function isPhysicalHealthValid(formData: any): boolean {
  return !!formData.height && !!formData.weight;
}

export function PhysicalHealthForm({
  formData,
  updateFormData,
}: PhysicalHealthFormProps) {
  const [connectOpen, setConnectOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);

    const isValid =
      !isNaN(height) && !isNaN(weight) && height > 0 && weight > 0;

    if (isValid) {
      const heightInMeters = height / 100;
      const newBmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

      if (formData.bmi !== newBmi) {
        updateFormData({ bmi: newBmi });
      }
    } else {
      if (formData.bmi !== "") {
        updateFormData({ bmi: "" });
      }
    }
  }, [formData.height, formData.weight]);

  const getBmiCategory = () => {
    const bmi = Number.parseFloat(formData.bmi);
    if (isNaN(bmi)) return null;

    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { category: "Normal weight", color: "text-green-500" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" };
    return { category: "Obesity", color: "text-red-500" };
  };

  const bmiCategory = getBmiCategory();

  const handleSwitchChange = (checked: boolean) => {
    updateFormData({ hasFitbit: checked });
    if (checked) {
      setConnectOpen(true);
    }
  };

  const ConnectUI = (
    <div>
      <h2 className="text-lg font-semibold mb-2">Connect Fitbit</h2>
      <p className="text-sm text-gray-600 mb-4">
        To sync your steps, heart rate, and sleep data, connect your Fitbit
        account.
      </p>
      <button className="bg-[#005dff] text-white px-4 py-2 rounded hover:bg-[#0049cc] w-full">
        Connect Fitbit Account
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[#000000]">
          Physical Health
        </h2>
        <p className="text-[#747474]">
          Please provide your physical measurements and device preferences.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => updateFormData({ height: e.target.value })}
            className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
            placeholder="e.g., 170"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => updateFormData({ weight: e.target.value })}
            className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
            placeholder="e.g., 70"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bmi">BMI</Label>
          <div className="relative">
            <Input
              id="bmi"
              value={formData.bmi}
              readOnly
              className="h-12 border-[#d1d1d1] bg-gray-50"
              placeholder="Auto-calculated"
            />
            {bmiCategory && (
              <div
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${bmiCategory.color}`}
              >
                {bmiCategory.category}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <Label>Device Sync</Label>
        <p className="text-sm text-[#747474] mb-3">
          Connect your fitness devices to automatically sync your health data
        </p>

        <div>
          <button
            type="button"
            onClick={() => handleSwitchChange(!formData.hasFitbit)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
              formData.hasFitbit
                ? "border-[#005dff] bg-[#005dff]/10 text-[#005dff]"
                : "border-[#d1d1d1] bg-white text-gray-700 hover:border-[#005dff]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formData.hasFitbit
                    ? "bg-[#005dff]/20 text-[#005dff]"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Watch size={20} />
              </div>
              <span className="font-medium">
                {formData.hasFitbit
                  ? "Fitbit Connected"
                  : "Connect your Fitbit"}
              </span>
            </div>
            <Switch
              checked={formData.hasFitbit}
              onCheckedChange={handleSwitchChange}
            />
          </button>
        </div>

        {formData.hasFitbit && (
          <div className="p-4 bg-[#005dff]/5 rounded-lg border border-[#005dff]/20 mt-3">
            <p className="text-sm text-[#005dff]/90">
              You'll be prompted to connect your Fitbit account after completing
              this form. This will allow us to sync your activity data, sleep
              patterns, and heart rate information to provide personalized
              health insights.
            </p>
          </div>
        )}
      </div>

      {/* Dialog for desktop, Drawer for mobile */}
      {isMobile ? (
        <Drawer open={connectOpen} onOpenChange={setConnectOpen}>
          <DrawerContent className="p-4">{ConnectUI}</DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
          <DialogContent className="p-6">{ConnectUI}</DialogContent>
        </Dialog>
      )}
    </div>
  );
}
