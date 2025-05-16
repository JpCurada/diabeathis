import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalDetailsFormProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function isPersonalDetailsValid(data: any): boolean {
  return !!data.firstName?.trim() && !!data.lastName?.trim();
}

export function PersonalDetailsForm({
  formData,
  updateFormData,
}: PersonalDetailsFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[#000000]">
          Personal Details
        </h2>
        <p className="text-[#747474]">
          Please confirm your personal information below.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" required>
            First Name
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
            className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={formData.middleName}
            onChange={(e) => updateFormData({ middleName: e.target.value })}
            className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastName" required>
            Last Name
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="suffix">Suffix (Optional)</Label>
          <Input
            id="suffix"
            value={formData.suffix}
            onChange={(e) => updateFormData({ suffix: e.target.value })}
            className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
            placeholder="Jr., Sr., III, etc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" required>
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          disabled
          className="h-12 border-[#d1d1d1] bg-gray-50 text-gray-500"
        />
      </div>
    </div>
  );
}
