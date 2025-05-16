import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Watch } from "lucide-react";
import { useIsMobile } from "@/lib/hooks/use-is-mobile"; // your custom hook

export function FitbitConnectCard({ formData, updateFormData }) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSwitchChange = (checked: boolean) => {
    updateFormData({ hasFitbit: checked });
    setOpen(checked); // Open connect UI only if enabled
  };

  const ConnectUI = (
    <>
      <h2 className="text-lg font-semibold mb-2">Connect Fitbit</h2>
      <p className="text-sm text-gray-600 mb-4">
        To sync your steps, heart rate, and sleep data, connect your Fitbit
        account.
      </p>
      <button className="bg-[#005dff] text-white px-4 py-2 rounded hover:bg-[#0049cc] w-full">
        Connect Fitbit Account
      </button>
    </>
  );

  return (
    <div className="space-y-3 pt-4">
      <Label>Device Sync</Label>
      <p className="text-sm text-[#747474] mb-3">
        Connect your fitness devices to automatically sync your health data
      </p>

      <Card
        className={`cursor-pointer transition-colors ${
          formData.hasFitbit ? "border-[#005dff]" : "border-[#d1d1d1]"
        } hover:border-[#005dff]`}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                formData.hasFitbit
                  ? "bg-[#005dff]/20 text-[#005dff]"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <Watch size={20} />
            </div>
            <div>
              <h3 className="font-medium">Fitbit</h3>
              <p className="text-sm text-[#747474]">
                {formData.hasFitbit ? "Connected" : "Connect your Fitbit"}
              </p>
            </div>
          </div>
          <Switch
            checked={formData.hasFitbit}
            onCheckedChange={handleSwitchChange}
          />
        </CardContent>
      </Card>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <div className="p-4">{ConnectUI}</div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="p-6">{ConnectUI}</DialogContent>
        </Dialog>
      )}
    </div>
  );
}
