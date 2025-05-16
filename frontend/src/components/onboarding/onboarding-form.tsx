import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { PersonalDetailsForm } from "@/components/onboarding/personal-details-form";
import { DemographicInfoForm } from "@/components/onboarding/demographic-info-form";
import { DiabetesDetailsForm } from "@/components/onboarding/diabetes-details-form";
import { PhysicalHealthForm } from "@/components/onboarding/physical-health-form";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import {
  saveDemographicInfo,
  saveDiabetesDetails,
  savePhysicalHealth,
  saveMedicines,
} from "@/lib/onboarding-supabase";
import { isDemographicInfoValid } from "./demographic-info-form";
import { isDiabetesDetailsValid } from "./diabetes-details-form";
import { isPhysicalHealthValid } from "./physical-health-form";
import { isPersonalDetailsValid } from "./personal-details-form";
import { supabase } from "@/supabase/config";

export function OnboardingForm({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: user?.firstName || "",
    middleName: user?.middleName || "",
    lastName: user?.lastName || "",
    suffix: user?.suffix || "",
    email: user?.email || "",
    // Demographic Information
    birthday: "",
    sex: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    zipCode: "",
    otherAddress: "",
    displayAddress: "",
    regionCode: "",
    provinceCode: "",
    cityCode: "",
    barangayCode: "",
    // Diabetes Details
    diabetesType: "",
    hasMaintenance: false,
    maintenanceMeds: [],
    // Physical Health
    height: "",
    weight: "",
    bmi: "",
    hasFitbit: false,
  });
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  const totalSteps = 4;

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = async () => {
    let valid = false;

    if (currentStep === 1) valid = isPersonalDetailsValid(formData);
    if (currentStep === 2) valid = isDemographicInfoValid(formData);
    if (currentStep === 3) valid = isDiabetesDetailsValid(formData);
    if (currentStep === 4) valid = isPhysicalHealthValid(formData);

    if (!valid) {
      setStepError("Please complete all required fields.");
      return;
    }

    setStepError(null);

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step reached and valid — show the submit button
      setIsReadyToSubmit(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (stepError) setStepError(null); // Clear errors when switching steps
  }, [currentStep]);

  const handleSubmit = async () => {
    try {
      if (currentStep === totalSteps) {
        await saveDemographicInfo(user.id, formData);
        await saveDiabetesDetails(user.id, formData);
        await savePhysicalHealth(user.id, formData);

        if (formData.hasMaintenance && formData.maintenanceMeds.length > 0) {
          await saveMedicines(user.id, formData.maintenanceMeds);
        }

        await supabase
          .from("users")
          .update({ onboarding_completed: true })
          .eq("id", user.id);

        onComplete();
      }
    } catch (err: any) {
      setStepError("Failed to save: " + err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Progress Header */}
      <div className="bg-[#005dff] p-6 text-white">
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
        <p className="text-white/80 mt-1">
          Please provide some additional information to help us personalize your
          experience
        </p>

        {/* Step Indicator */}
        <div className="mt-6 flex items-center justify-center">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep > index + 1
                    ? "bg-white text-[#005dff]"
                    : currentStep === index + 1
                    ? "bg-white text-[#005dff] ring-4 ring-white/30"
                    : "bg-white/30 text-white"
                }`}
              >
                {currentStep > index + 1 ? (
                  <CheckCircle size={16} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`w-12 h-1 mx-1 ${
                    currentStep > index + 1 ? "bg-white" : "bg-white/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {currentStep === 1 && (
          <PersonalDetailsForm
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 2 && (
          <DemographicInfoForm
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 3 && (
          <DiabetesDetailsForm
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 4 && (
          <PhysicalHealthForm
            formData={formData}
            updateFormData={updateFormData}
          />
        )}

        {/* Navigation Buttons */}
        <div className="mt-8">
          {stepError && (
            <p className="text-red-500 mb-4 text-sm font-medium">{stepError}</p>
          )}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-[#d1d1d1] text-[#000000]"
            >
              Back
            </Button>

            <div className="flex gap-2">
              {currentStep < totalSteps && (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#005dff] hover:bg-[#005dff]/90 text-white"
                >
                  Next
                </Button>
              )}

              {currentStep === totalSteps && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit All
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
