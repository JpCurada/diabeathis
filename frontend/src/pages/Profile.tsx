import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  User,
  MapPin,
  Activity,
  Heart,
  LogOut,
  Key,
  Phone,
  Plus,
} from "lucide-react";
import { EmergencyContactsList } from "@/components/profile/emergency-contacts-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import {
  getDemographicInfo,
  getPhysicalHealth,
  getDiabetesDetails,
  getMedicines,
} from "@/lib/onboarding-supabase";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [demographicInfo, setDemographicInfo] = useState<any>(null);
  const [physicalHealth, setPhysicalHealth] = useState<any>(null);
  const [diabetesDetails, setDiabetesDetails] = useState<any>(null);
  const [medicines, setMedicines] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        const [demographic, physical, diabetes, meds] = await Promise.all([
          getDemographicInfo(user.id),
          getPhysicalHealth(user.id),
          getDiabetesDetails(user.id),
          getMedicines(user.id),
        ]);
        setDemographicInfo(demographic);
        setPhysicalHealth(physical);
        setDiabetesDetails(diabetes);
        setMedicines(meds || []);
      } catch (err) {
        // Optionally handle error
        console.error("Failed to fetch profile data:", err);
      }
    };

    fetchProfileData();
  }, [user]);

  const profileData = {
    // Personal Details
    firstName: user.first_name || "",
    middleName: user.middle_name || "",
    lastName: user.last_name || "",
    suffix: user.suffix || "",
    email: user.email || "",

    // Demographic Information
    birthday: demographicInfo?.birthday || "",
    sex: demographicInfo?.sex || "",
    displayAddress: demographicInfo
      ? [
          demographicInfo.barangay,
          demographicInfo.city,
          demographicInfo.province,
          demographicInfo.region,
          demographicInfo.zip_code,
          "Philippines",
        ]
          .filter(Boolean)
          .join(", ")
      : "",

    // Diabetes Details
    diabetesType: diabetesDetails?.diabetes_type || "",
    hasMaintenance: diabetesDetails?.has_maintenance || false,
    maintenanceMeds: medicines.map((med) => ({
      medicineName: med.name,
      ...(med.med_schedule && med.med_schedule.length > 0
        ? {
            medicineAmount: med.med_schedule[0].amount,
            medicineFrequency: med.med_schedule[0].frequency,
          }
        : {
            medicineAmount: "",
            medicineFrequency: "",
          }),
    })),

    // Physical Health
    height: physicalHealth?.height || "",
    weight: physicalHealth?.weight || "",
    bmi: physicalHealth?.bmi || "",
    hasFitbit: false, // Update if you have this info
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Not provided";
    }
  };

  const getDiabetesTypeLabel = (type: string) => {
    switch (type) {
      case "type1":
        return "Type 1 Diabetes";
      case "type2":
        return "Type 2 Diabetes";
      case "gestational":
        return "Gestational Diabetes";
      default:
        return "Not specified";
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "once_daily":
        return "Once daily";
      case "twice_daily":
        return "Twice daily";
      case "three_times_daily":
        return "Three times daily";
      case "four_times_daily":
        return "Four times daily";
      case "as_needed":
        return "As needed";
      default:
        return "Not specified";
    }
  };

  const getBmiCategory = (bmi: string) => {
    const bmiValue = Number.parseFloat(bmi);
    if (isNaN(bmiValue)) return "Not calculated";

    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal weight";
    if (bmiValue < 30) return "Overweight";
    return "Obesity";
  };

  const getBmiColor = (bmi: string) => {
    const bmiValue = Number.parseFloat(bmi);
    if (isNaN(bmiValue)) return "text-gray-500";

    if (bmiValue < 18.5) return "text-blue-500";
    if (bmiValue < 25) return "text-green-500";
    if (bmiValue < 30) return "text-yellow-500";
    return "text-red-500";
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-[#000000]">My Profile</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Dialog
              open={isPasswordDialogOpen}
              onOpenChange={setIsPasswordDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-[#d1d1d1] w-full sm:w-auto"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-w-[95vw] w-full">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Update your account password
                  </DialogDescription>
                </DialogHeader>
                <ChangePasswordForm
                  onSuccess={() => setIsPasswordDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <Button
              onClick={() => {
                navigate("/profile/edit");
              }}
              className="bg-[#005dff] hover:bg-[#005dff]/90 w-full sm:w-auto"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="personal"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger
              value="personal"
              className="flex items-center justify-center"
            >
              <User className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger
              value="demographic"
              className="flex items-center justify-center"
            >
              <MapPin className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Demographic</span>
            </TabsTrigger>
            <TabsTrigger
              value="diabetes"
              className="flex items-center justify-center"
            >
              <Heart className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Diabetes</span>
            </TabsTrigger>
            <TabsTrigger
              value="health"
              className="flex items-center justify-center"
            >
              <Activity className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Health</span>
            </TabsTrigger>
            <TabsTrigger
              value="emergency"
              className="flex items-center justify-center"
            >
              <Phone className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Emergency</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>
                  Your basic personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#747474]">First Name</p>
                    <p className="font-medium">{profileData.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#747474]">Middle Name</p>
                    <p className="font-medium">
                      {profileData.middleName || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#747474]">Last Name</p>
                    <p className="font-medium">{profileData.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#747474]">Suffix</p>
                    <p className="font-medium">
                      {profileData.suffix || "Not provided"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#747474]">Email Address</p>
                  <p className="font-medium">{profileData.email}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographic">
            <Card>
              <CardHeader>
                <CardTitle>Demographic Information</CardTitle>
                <CardDescription>Your demographic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#747474]">Date of Birth</p>
                    <p className="font-medium">
                      {formatDate(profileData.birthday)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#747474]">Sex</p>
                    <p className="font-medium capitalize">{profileData.sex}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#747474]">Address</p>
                  <p className="font-medium">{profileData.displayAddress}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diabetes">
            <Card>
              <CardHeader>
                <CardTitle>Diabetes Details</CardTitle>
                <CardDescription>
                  Your diabetes condition information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-[#747474]">Diabetes Type</p>
                  <p className="font-medium">
                    {getDiabetesTypeLabel(profileData.diabetesType)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#747474]">Maintenance Medicine</p>
                  <p className="font-medium">
                    {profileData.hasMaintenance ? "Yes" : "No"}
                  </p>
                </div>

                {profileData.hasMaintenance &&
                  profileData.maintenanceMeds &&
                  profileData.maintenanceMeds.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Medications</p>
                      {profileData.maintenanceMeds.map(
                        (med: any, index: number) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg border border-[#d1d1d1]"
                          >
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-[#747474]">
                                  Medicine Name
                                </p>
                                <p className="font-medium">
                                  {med.medicineName}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-[#747474]">Amount</p>
                                <p className="font-medium">
                                  {med.medicineAmount} mg
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-[#747474]">
                                  Frequency
                                </p>
                                <p className="font-medium">
                                  {getFrequencyLabel(med.medicineFrequency)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>Physical Health</CardTitle>
                <CardDescription>
                  Your physical measurements and device connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-[#747474]">Height</p>
                    <p className="font-medium">{profileData.height} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#747474]">Weight</p>
                    <p className="font-medium">{profileData.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#747474]">BMI</p>
                    <div className="flex items-center">
                      <p className="font-medium">{profileData.bmi}</p>
                      <span
                        className={`ml-2 text-sm ${getBmiColor(
                          profileData.bmi
                        )}`}
                      >
                        ({getBmiCategory(profileData.bmi)})
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#747474]">Connected Devices</p>
                  <div className="mt-2">
                    {profileData.hasFitbit ? (
                      <div className="flex items-center text-[#005dff]">
                        <div className="w-8 h-8 rounded-full bg-[#005dff]/10 flex items-center justify-center mr-2">
                          <Activity size={16} />
                        </div>
                        <span className="font-medium">Fitbit Connected</span>
                      </div>
                    ) : (
                      <p className="text-[#747474]">No devices connected</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>
                    People to contact in case of emergency
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    navigate("/profile/emergency-contacts");
                  }}
                  size="sm"
                  className="bg-[#005dff] hover:bg-[#005dff]/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </CardHeader>
              <CardContent>
                <EmergencyContactsList
                  contacts={profileData.emergencyContacts || []}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
