import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DiabetesDetailsFormProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function isDiabetesDetailsValid(formData: any): boolean {
  return !!formData.diabetesType;
}

export function DiabetesDetailsForm({
  formData,
  updateFormData,
}: DiabetesDetailsFormProps) {
  const handleMedicineChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedMeds = [...formData.maintenanceMeds];
    updatedMeds[index] = {
      ...updatedMeds[index], // Ensure we preserve other fields
      [field]: value,
    };
    updateFormData({ maintenanceMeds: updatedMeds });
  };

  const addMedicine = () => {
    const updatedMeds = [
      ...formData.maintenanceMeds,
      { medicineName: "", medicineAmount: "", medicineFrequency: "" },
    ];
    updateFormData({ maintenanceMeds: updatedMeds });
  };

  const removeMedicine = (index: number) => {
    const updatedMeds = [...formData.maintenanceMeds];
    if (updatedMeds.length > 1) {
      updatedMeds.splice(index, 1);
      updateFormData({ maintenanceMeds: updatedMeds });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[#000000]">
          Diabetes Details
        </h2>
        <p className="text-[#747474]">
          Please provide information about your diabetes condition.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label required>Diabetes Type</Label>
          <RadioGroup
            value={formData.diabetesType}
            onValueChange={(value) => updateFormData({ diabetesType: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-[#d1d1d1] hover:border-[#005dff]/50 transition-colors">
              <RadioGroupItem value="type1" id="type1" />
              <div>
                <Label htmlFor="type1" className="cursor-pointer font-medium">
                  Type 1 Diabetes
                </Label>
                <p className="text-sm text-[#747474]">
                  Your body doesn't make insulin or makes very little insulin
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border border-[#d1d1d1] hover:border-[#005dff]/50 transition-colors">
              <RadioGroupItem value="type2" id="type2" />
              <div>
                <Label htmlFor="type2" className="cursor-pointer font-medium">
                  Type 2 Diabetes
                </Label>
                <p className="text-sm text-[#747474]">
                  Your body doesn't use insulin well and can't keep blood sugar
                  at normal levels
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border border-[#d1d1d1] hover:border-[#005dff]/50 transition-colors">
              <RadioGroupItem value="gestational" id="gestational" />
              <div>
                <Label
                  htmlFor="gestational"
                  className="cursor-pointer font-medium"
                >
                  Gestational Diabetes
                </Label>
                <p className="text-sm text-[#747474]">
                  Develops in pregnant women who have never had diabetes
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="hasMaintenance" className="cursor-pointer block">
                Do you take maintenance medicine?
              </Label>
              <p className="text-sm text-[#747474]">
                Let us know if you're currently taking any medication
              </p>
            </div>
            <Switch
              id="hasMaintenance"
              checked={formData.hasMaintenance}
              onCheckedChange={(checked) => {
                updateFormData({
                  hasMaintenance: checked,
                  maintenanceMeds: checked ? formData.maintenanceMeds : [],
                });
              }}
            />
          </div>
        </div>

        {formData.hasMaintenance && (
          <div className="space-y-4 mt-3">
            {(formData.maintenanceMeds || []).map((med: any, index: number) => (
              <div
                key={med.id || index}
                className="space-y-4 p-4 bg-gray-50 rounded-lg border border-[#d1d1d1] relative"
              >
                {formData.maintenanceMeds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                    aria-label="Remove medicine"
                  >
                    <X size={16} />
                  </button>
                )}

                <div className="space-y-2">
                  <Label htmlFor={`medicineName-${index}`} required>
                    Medicine Name
                  </Label>
                  <Input
                    id={`medicineName-${index}`}
                    value={med.medicineName}
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        "medicineName",
                        e.target.value
                      )
                    }
                    placeholder="Enter medicine name"
                    className="border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`medicineAmount-${index}`} required>
                      Amount (mg)
                    </Label>
                    <Input
                      id={`medicineAmount-${index}`}
                      type="number"
                      value={med.medicineAmount}
                      onChange={(e) =>
                        handleMedicineChange(
                          index,
                          "medicineAmount",
                          e.target.value
                        )
                      }
                      placeholder="e.g., 500"
                      className="border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
                    />
                  </div>

                  <div className="space-y-2 ">
                    <Label htmlFor={`medicineFrequency-${index}`} required>
                      Frequency
                    </Label>
                    <Select
                      value={med.medicineFrequency}
                      onValueChange={(value) =>
                        handleMedicineChange(index, "medicineFrequency", value)
                      }
                    >
                      <SelectTrigger className=" border-[#d1d1d1] w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once_daily">Once daily</SelectItem>
                        <SelectItem value="twice_daily">Twice daily</SelectItem>
                        <SelectItem value="three_times_daily">
                          Three times daily
                        </SelectItem>
                        <SelectItem value="four_times_daily">
                          Four times daily
                        </SelectItem>
                        <SelectItem value="as_needed">As needed</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addMedicine}
            >
              + Add Another Medicine
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
