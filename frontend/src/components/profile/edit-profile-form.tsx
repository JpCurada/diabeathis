import { useEffect, useState } from "react";
import type { User } from "@/context/auth-context";
import { PersonalDetailsForm } from "@/components/onboarding/personal-details-form";
import { DemographicInfoForm } from "@/components/onboarding/demographic-info-form";
import { DiabetesDetailsForm } from "@/components/onboarding/diabetes-details-form";
import { PhysicalHealthForm } from "@/components/onboarding/physical-health-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserIcon,
  MapPin,
  Activity,
  Heart,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getDemographicInfo,
  getPhysicalHealth,
  getDiabetesDetails,
  getMedicines,
  updateDemographicInfo,
  updatePhysicalHealth,
  updateDiabetesDetails,
  updateMedicine,
  updateMedSchedule,
  updateUser,
  getUser,
} from "@/lib/onboarding-supabase";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useNavigate } from "react-router-dom";

interface EditProfileFormProps {
  user: User;
  onComplete: () => void;
}

export function EditProfileForm({ user, onComplete }: EditProfileFormProps) {
  const { updateUserData, userData } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Personal Details
    firstName: user.firstName || "",
    middleName: user.middleName || "",
    lastName: user.lastName || "",
    suffix: user.suffix || "",
    email: user.email || "",

    // Demographic Information
    birthday: userData?.birthday || "",
    sex: userData?.sex || "",
    region: userData?.region || "",
    province: userData?.province || "",
    city: userData?.city || "",
    barangay: userData?.barangay || "",
    zipCode: userData?.zipCode || "",
    otherAddress: userData?.otherAddress || "",
    displayAddress: userData?.displayAddress || "",
    regionCode: userData?.regionCode || "",
    provinceCode: userData?.provinceCode || "",
    cityCode: userData?.cityCode || "",
    barangayCode: userData?.barangayCode || "",

    // Diabetes Details
    diabetesType: userData?.diabetesType || "",
    hasMaintenance: userData?.hasMaintenance || false,
    medicineName: userData?.medicineName || "",
    medicineAmount: userData?.medicineAmount || "",
    medicineFrequency: userData?.medicineFrequency || "",
    maintenanceMeds: [
      { medicineName: "", medicineAmount: "", medicineFrequency: "" },
    ],

    // Physical Health
    height: userData?.height || "",
    weight: userData?.weight || "",
    bmi: userData?.bmi || "",
    hasFitbit: userData?.hasFitbit || false,
  });

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const userDetails = await getUser(user.id);

        const [demographic, physical, diabetes, meds] = await Promise.all([
          getDemographicInfo(user.id),
          getPhysicalHealth(user.id),
          getDiabetesDetails(user.id),
          getMedicines(user.id),
        ]);
        setFormData((prev) => ({
          ...prev,
          // Personal
          firstName: userDetails.first_name || "",
          middleName: userDetails.middle_name || "",
          lastName: userDetails.last_name || "",
          suffix: userDetails.suffix || "",
          email: userDetails.email || "",
          // Demographic
          birthday: demographic?.birthday || "",
          sex: demographic?.sex || "",
          region: demographic?.region || "",
          province: demographic?.province || "",
          city: demographic?.city || "",
          barangay: demographic?.barangay || "",
          zipCode: demographic?.zip_code || "",
          otherAddress: demographic?.other_address || "",
          regionCode: demographic?.region_code || "",
          provinceCode: demographic?.province_code || "",
          cityCode: demographic?.city_code || "",
          barangayCode: demographic?.barangay_code || "",
          // Diabetes
          diabetesType: diabetes?.diabetes_type || "",
          hasMaintenance: diabetes?.has_maintenance || false,
          // Physical
          height: physical?.height || "",
          weight: physical?.weight || "",
          bmi: physical?.bmi || "",
          maintenanceMeds:
            meds && meds.length > 0
              ? meds.map((med: any) => ({
                  medicineName: med.name,
                  medicineAmount: med.med_schedule?.[0]?.amount || "",
                  medicineFrequency: med.med_schedule?.[0]?.frequency || "",
                  id: med.id,
                  medScheduleId: med.med_schedule?.[0]?.id,
                }))
              : [],
        }));
        setMedicines(meds || []);
      } catch (err) {
        // Optionally handle error
      }
      setLoading(false);
    }
    fetchAll();
    // eslint-disable-next-line
  }, [user.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Initialize form data with existing user data or defaults

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Update name fields in users table
      await updateUser(user.id, {
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        suffix: formData.suffix,
      });
      // Update demographic info
      await updateDemographicInfo(user.id, {
        birthday: formData.birthday,
        sex: formData.sex,
        region: formData.region,
        province: formData.province,
        city: formData.city,
        barangay: formData.barangay,
        zip_code: formData.zipCode,
        other_address: formData.otherAddress,
        region_code: formData.regionCode,
        province_code: formData.provinceCode,
        city_code: formData.cityCode,
        barangay_code: formData.barangayCode,
      });

      // Update diabetes details
      await updateDiabetesDetails(user.id, {
        diabetesType: formData.diabetesType,
        hasMaintenance: formData.hasMaintenance,
      });

      // Update physical health
      await updatePhysicalHealth(user.id, {
        height: formData.height,
        weight: formData.weight,
        bmi: formData.bmi,
      });

      // Update medicines and schedules
      for (const med of medicines) {
        await updateMedicine(med.id, { name: med.name });
        if (med.med_schedule && med.med_schedule.length > 0) {
          await updateMedSchedule(med.med_schedule[0].id, {
            amount: med.med_schedule[0].amount,
            frequency: med.med_schedule[0].frequency,
          });
        }
      }

      if (updateUserData) {
        updateUserData(formData);
      }

      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#005dff] p-6 text-white">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 mr-2"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-white/80 mt-1">
              Update your profile information
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {saveSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <AlertDescription>
              Your profile has been successfully updated!
            </AlertDescription>
          </Alert>
        )}

        <Tabs
          defaultValue="personal"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="personal" className="flex items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="demographic" className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Demographic</span>
            </TabsTrigger>
            <TabsTrigger value="diabetes" className="flex items-center">
              <Heart className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Diabetes</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Health</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <PersonalDetailsForm
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="demographic">
            <DemographicInfoForm
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="diabetes">
            <DiabetesDetailsForm
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="health">
            <PhysicalHealthForm
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => (window.location.href = "/profile")}
            className="border-[#d1d1d1] text-[#000000]"
          >
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#005dff] hover:bg-[#005dff]/90 text-white"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onComplete}
              className="bg-[#005dff] hover:bg-[#005dff]/90 text-white"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
