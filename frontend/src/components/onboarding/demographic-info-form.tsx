import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

interface DemographicInfoFormProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function isDemographicInfoValid(formData: any): boolean {
  return (
    !!formData.birthday &&
    !!formData.sex &&
    !!formData.region &&
    !!formData.province &&
    !!formData.city &&
    !!formData.barangay &&
    !!formData.zipCode
  );
}

export function DemographicInfoForm({
  formData,
  updateFormData,
}: DemographicInfoFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    formData.birthday ? new Date(formData.birthday) : undefined
  );

  // Address state
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [barangays, setBarangays] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState(
    formData.regionCode || ""
  );
  const [selectedProvince, setSelectedProvince] = useState(
    formData.provinceCode || ""
  );
  const [selectedCity, setSelectedCity] = useState(formData.cityCode || "");
  const [selectedBarangay, setSelectedBarangay] = useState(
    formData.barangayCode || ""
  );
  const [zipCode, setZipCode] = useState(formData.zipCode || "");
  const [otherAddress, setOtherAddress] = useState(formData.otherAddress || "");
  const [isLoadingRegions, setIsLoadingRegions] = useState(true);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initializationStarted, setInitializationStarted] = useState(false);

  // Update the birthday in the parent form when date changes
  useEffect(() => {
    if (date) {
      updateFormData({ ...formData, birthday: date.toISOString() });
    }
  }, [date]);

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      setIsLoadingRegions(true);
      try {
        const response = await fetch("https://psgc.cloud/api/regions");
        const data = await response.json();
        if (Array.isArray(data)) {
          setRegions(data);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
      } finally {
        setIsLoadingRegions(false);
      }
    };

    fetchRegions();
  }, []);

  // Improved initialization for pre-filled form data
  useEffect(() => {
    const initializeFormData = async () => {
      // Only start initialization if we have regions and a regionCode
      if (regions.length > 0 && formData.regionCode && !initializationStarted) {
        setInitializationStarted(true);
        console.log("Starting form initialization with:", formData);

        try {
          await fetchProvinces(formData.regionCode);
          if (formData.provinceCode) {
            await fetchCities(formData.provinceCode);
            if (formData.cityCode) {
              await fetchBarangays(formData.cityCode);
              if (formData.barangayCode) {
                setSelectedBarangay(formData.barangayCode);
              }
            }
          }
        } catch (error) {
          console.error("Error during form initialization:", error);
        }
      }
    };

    initializeFormData();
  }, [regions, formData.regionCode]);

  const fetchProvinces = async (regionCode: string) => {
    setIsLoadingProvinces(true);
    try {
      const response = await fetch(
        `https://psgc.cloud/api/regions/${regionCode}/provinces`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setProvinces(data);
        setSelectedRegion(regionCode);
        console.log(
          `Fetched ${data.length} provinces for region ${regionCode}`
        );
      } else {
        console.error("Invalid provinces data format:", data);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
    } finally {
      setIsLoadingProvinces(false);
    }
    return true;
  };

  const fetchCities = async (provinceCode: string) => {
    setIsLoadingCities(true);
    try {
      const response = await fetch(
        `https://psgc.cloud/api/provinces/${provinceCode}/cities-municipalities`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setCities(data);
        setSelectedProvince(provinceCode);
        console.log(
          `Fetched ${data.length} cities for province ${provinceCode}`
        );
      } else {
        console.error("Invalid cities data format:", data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setIsLoadingCities(false);
    }
    return true;
  };

  const fetchBarangays = async (cityCode: string) => {
    setIsLoadingBarangays(true);
    try {
      const response = await fetch(
        `https://psgc.cloud/api/municipalities/${cityCode}/barangays`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setBarangays(data);
        setSelectedCity(cityCode);
        console.log(`Fetched ${data.length} barangays for city ${cityCode}`);
      } else {
        console.error("Invalid barangays data format:", data);
      }
    } catch (error) {
      console.error("Error fetching barangays:", error);
    } finally {
      setIsLoadingBarangays(false);
    }
    return true;
  };

  // Handler for region changes
  const handleRegionChange = async (value: string) => {
    setSelectedRegion(value);
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedBarangay("");
    setProvinces([]);
    setCities([]);
    setBarangays([]);
    setErrors({});

    updateFormData({
      ...formData,
      regionCode: value,
      region: regions.find((r) => r.code === value)?.name || "",
      provinceCode: "",
      province: "",
      cityCode: "",
      city: "",
      barangayCode: "",
      barangay: "",
    });

    if (value) {
      await fetchProvinces(value);
    }
  };

  // Handler for province changes
  const handleProvinceChange = async (value: string) => {
    setSelectedProvince(value);
    setSelectedCity("");
    setSelectedBarangay("");
    setCities([]);
    setBarangays([]);
    setErrors({});

    updateFormData({
      ...formData,
      provinceCode: value,
      province: provinces.find((p) => p.code === value)?.name || "",
      cityCode: "",
      city: "",
      barangayCode: "",
      barangay: "",
    });

    if (value) {
      await fetchCities(value);
    }
  };

  // Handler for city changes
  const handleCityChange = async (value: string) => {
    setSelectedCity(value);
    setSelectedBarangay("");
    setBarangays([]);
    setErrors({});

    updateFormData({
      ...formData,
      cityCode: value,
      city: cities.find((c) => c.code === value)?.name || "",
      barangayCode: "",
      barangay: "",
    });

    if (value) {
      await fetchBarangays(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[#000000]">
          Demographic Information
        </h2>
        <p className="text-[#747474]">
          Please provide your demographic details.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="birthday" required>
            Date of Birth
          </Label>
          <Input
            id="birthday"
            type="date"
            value={date ? date.toISOString().split("T")[0] : ""}
            onChange={(e) => {
              const value = e.target.value;
              setDate(value ? new Date(value) : undefined);
            }}
            max={new Date().toISOString().split("T")[0]}
            className="w-full h-12 border-[#d1d1d1]"
            required
          />
        </div>

        <div className="flex items-center space-x-4">
          <Label required>Sex</Label>
          <RadioGroup
            value={formData.sex}
            onValueChange={(value) =>
              updateFormData({ ...formData, sex: value })
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" className="" />
              <Label htmlFor="male" className="cursor-pointer">
                Male
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="cursor-pointer">
                Female
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="pt-2">
          <div className="grid grid-cols-1 items-center md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="region"
                className={errors.region ? "text-red-500" : ""}
                required
              >
                Region
              </Label>
              {isLoadingRegions ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedRegion}
                  onValueChange={handleRegionChange}
                >
                  <SelectTrigger
                    id="region"
                    className={`w-full
                      ${errors.region ? "border-red-500" : "border-[#d1d1d1]"}
                    `}
                  >
                    <SelectValue placeholder="Select a Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.code} value={region.code}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.region && (
                <p className="text-sm text-red-500">{errors.region}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="province"
                className={errors.province ? "text-red-500" : ""}
                required
              >
                Province
              </Label>
              {isLoadingProvinces ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedProvince}
                  onValueChange={handleProvinceChange}
                  disabled={!selectedRegion || provinces.length === 0}
                >
                  <SelectTrigger
                    id="province"
                    className={`w-full
                      ${errors.province ? "border-red-500" : "border-[#d1d1d1]"}
                    `}
                  >
                    <SelectValue
                      placeholder={
                        provinces.length === 0
                          ? "No provinces available"
                          : "Select a Province"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.code} value={province.code}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.province && (
                <p className="text-sm text-red-500">{errors.province}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="city"
                className={errors.city ? "text-red-500" : ""}
                required
              >
                City/Municipality
              </Label>
              {isLoadingCities ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedCity}
                  onValueChange={handleCityChange}
                  disabled={!selectedProvince || cities.length === 0}
                >
                  <SelectTrigger
                    id="city"
                    className={`w-full
                      ${errors.city ? "border-red-500" : "border-[#d1d1d1]"}
                    `}
                  >
                    <SelectValue
                      placeholder={
                        cities.length === 0
                          ? "No cities available"
                          : "Select a City"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.code} value={city.code}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="barangay"
                className={errors.barangay ? "text-red-500" : ""}
                required
              >
                Barangay
              </Label>
              {isLoadingBarangays ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedBarangay}
                  onValueChange={(value) => {
                    setSelectedBarangay(value);
                    updateFormData({
                      ...formData,
                      barangayCode: value,
                      barangay:
                        barangays.find((b) => b.code === value)?.name || "",
                    });
                  }}
                  disabled={!selectedCity || barangays.length === 0}
                >
                  <SelectTrigger
                    id="barangay"
                    className={`w-full
                      ${errors.barangay ? "border-red-500" : "border-[#d1d1d1]"}
                    `}
                  >
                    <SelectValue
                      placeholder={
                        barangays.length === 0
                          ? "No barangays available"
                          : "Select a Barangay"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {barangays.map((barangay) => (
                      <SelectItem key={barangay.code} value={barangay.code}>
                        {barangay.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.barangay && (
                <p className="text-sm text-red-500">{errors.barangay}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="zipCode"
                className={errors.zipCode ? "text-red-500" : ""}
                required
              >
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                type="text"
                value={zipCode}
                onChange={(e) => {
                  const value = e.target.value;
                  setZipCode(value);
                  updateFormData({ ...formData, zipCode: value });
                }}
                placeholder="Enter ZIP code (e.g., 1000)"
                className={
                  errors.zipCode ? "border-red-500" : "border-[#d1d1d1] h-12"
                }
              />
              {errors.zipCode && (
                <p className="text-sm text-red-500">{errors.zipCode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherAddress">
                Other Address{" "}
                <span className="text-[#747474] text-sm">(Optional)</span>
              </Label>
              <Input
                id="otherAddress"
                type="text"
                value={otherAddress}
                onChange={(e) => {
                  const value = e.target.value;
                  setOtherAddress(value);
                  updateFormData({ ...formData, otherAddress: value });
                }}
                placeholder="House/Building No., Street, etc."
                className="border-[#d1d1d1] h-12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
