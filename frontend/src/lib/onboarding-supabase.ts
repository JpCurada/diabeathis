import { supabase } from "@/supabase/config";

// READ user by id
export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

// UPDATE user (excluding id and email)
export async function updateUser(
  userId: string,
  updatedFields: Partial<
    Omit<
      {
        first_name: string;
        middle_name: string;
        last_name: string;
        suffix: string;
        onboarding_completed: boolean;
      },
      "id" | "email"
    >
  >
) {
  const { id, email, ...fieldsToUpdate } = updatedFields as any;

  const { error } = await supabase
    .from("users")
    .update(fieldsToUpdate)
    .eq("id", userId);
  if (error) throw error;
}

// DELETE user by id
export async function deleteUser(userId: string) {
  const { error } = await supabase.from("users").delete().eq("id", userId);
  if (error) throw error;
}

// Save Demographic Info
export async function saveDemographicInfo(userId: string, formData: any) {
  const { error } = await supabase.from("demographic_info").upsert({
    user_id: userId,
    birthday: formData.birthday,
    sex: formData.sex,
    region: formData.region,
    region_code: formData.regionCode,
    province: formData.province,
    province_code: formData.provinceCode,
    city: formData.city,
    city_code: formData.cityCode,
    barangay: formData.barangay,
    barangay_code: formData.barangayCode,
    zip_code: formData.zipCode,
    other_address: formData.otherAddress,
  });
  if (error) throw error;
}

// READ
export async function getDemographicInfo(userId: string) {
  const { data, error } = await supabase
    .from("demographic_info")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
}

// UPDATE (same as save if using `upsert`), or separate if you prefer
export async function updateDemographicInfo(userId: string, formData: any) {
  const { error } = await supabase
    .from("demographic_info")
    .update(formData)
    .eq("user_id", userId);
  if (error) throw error;
}

// DELETE
export async function deleteDemographicInfo(userId: string) {
  const { error } = await supabase
    .from("demographic_info")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}

// Save Physical Health
export async function savePhysicalHealth(userId: string, formData: any) {
  const { error } = await supabase.from("physical_health").upsert({
    user_id: userId,
    height: formData.height,
    weight: formData.weight,
    bmi: formData.bmi,
  });
  if (error) throw error;
}

export async function getPhysicalHealth(userId: string) {
  const { data, error } = await supabase
    .from("physical_health")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updatePhysicalHealth(userId: string, formData: any) {
  const { error } = await supabase
    .from("physical_health")
    .update(formData)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function deletePhysicalHealth(userId: string) {
  const { error } = await supabase
    .from("physical_health")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}

export async function saveDiabetesDetails(userId: string, formData: any) {
  const { error } = await supabase.from("diabetes_details").upsert({
    user_id: userId,
    diabetes_type: formData.diabetesType,
    has_maintenance: formData.hasMaintenance,
  });

  if (error) throw error;

  // Check if there are maintenance meds and they are valid
  if (
    formData.hasMaintenance &&
    Array.isArray(formData.maintenanceMeds) &&
    formData.maintenanceMeds.length > 0
  ) {
    await saveMedicines(userId, formData.maintenanceMeds);
  }
}

export async function getDiabetesDetails(userId: string) {
  const { data, error } = await supabase
    .from("diabetes_details")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateDiabetesDetails(userId: string, formData: any) {
  const { error } = await supabase
    .from("diabetes_details")
    .update({
      diabetes_type: formData.diabetesType,
      has_maintenance: formData.hasMaintenance,
    })
    .eq("user_id", userId);
  if (error) throw error;
}

export async function deleteDiabetesDetails(userId: string) {
  const { error } = await supabase
    .from("diabetes_details")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}

// Save Medicines and Schedules
export async function saveMedicines(userId: string, medicines: any[]) {
  if (!Array.isArray(medicines) || medicines.length === 0) {
    throw new Error("No medicines found to save.");
  }

  for (const med of medicines) {
    // Validate medicine fields before saving
    if (!med.medicineName || !med.medicineAmount || !med.medicineFrequency) {
      throw new Error(
        "All medicine fields (name, amount, frequency) are required."
      );
    }

    // Check if medicine already exists in the maintenance_meds table
    const { data: existingMedicine, error: medError } = await supabase
      .from("maintenance_meds")
      .select("id")
      .eq("user_id", userId)
      .eq("name", med.medicineName)
      .limit(1); // Ensure only one row is returned

    if (medError) {
      throw medError;
    }

    let medicineId: string;

    if (existingMedicine && existingMedicine.length > 0) {
      // If the medicine already exists, use its ID
      medicineId = existingMedicine[0].id;
    } else {
      // If the medicine doesn't exist, insert it and get its ID
      const { data: medData, error: medInsertError } = await supabase
        .from("maintenance_meds")
        .insert([{ user_id: userId, name: med.medicineName }])
        .select()
        .single(); // Get the newly inserted medicine

      if (medInsertError) throw medInsertError;

      medicineId = medData.id;
    }

    // Check if the schedule for this medicine already exists
    const { data: existingSchedule, error: schedError } = await supabase
      .from("med_schedule")
      .select("id")
      .eq("medicine_id", medicineId)
      .eq("amount", med.medicineAmount)
      .eq("frequency", med.medicineFrequency)
      .limit(1); // Ensure only one row is returned

    if (schedError) throw schedError;

    if (!existingSchedule || existingSchedule.length === 0) {
      // If no existing schedule, insert the new schedule
      const schedule = {
        medicine_id: medicineId,
        amount: med.medicineAmount,
        frequency: med.medicineFrequency,
      };

      const { error: schedInsertError } = await supabase
        .from("med_schedule")
        .insert([schedule]);

      if (schedInsertError) throw schedInsertError;
    }
  }
}

export async function getMedicines(userId: string) {
  const { data, error } = await supabase
    .from("maintenance_meds")
    .select("*, med_schedule(*)")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function updateMedicine(medId: string, updatedFields: any) {
  const { error } = await supabase
    .from("maintenance_meds")
    .update(updatedFields)
    .eq("id", medId);
  if (error) throw error;
}

export async function deleteMedicine(medId: string) {
  // First delete the schedule
  const { error: schedError } = await supabase
    .from("med_schedule")
    .delete()
    .eq("medicine_id", medId);
  if (schedError) throw schedError;

  // Then delete the medicine
  const { error: medError } = await supabase
    .from("maintenance_meds")
    .delete()
    .eq("id", medId);
  if (medError) throw medError;
}

export async function updateMedSchedule(scheduleId: string, fields: any) {
  const { error } = await supabase
    .from("med_schedule")
    .update(fields)
    .eq("id", scheduleId);
  if (error) throw error;
}

export async function deleteMedSchedule(scheduleId: string) {
  const { error } = await supabase
    .from("med_schedule")
    .delete()
    .eq("id", scheduleId);
  if (error) throw error;
}
