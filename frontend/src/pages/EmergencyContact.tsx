import type React from "react";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus } from "lucide-react";
import { EmergencyContactsList } from "@/components/profile/emergency-contacts-list";
import { useNavigate } from "react-router-dom";

export default function EmergencyContactsPage() {
  const { user, isAuthenticated, isLoading, userData, updateUserData } =
    useAuth();
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  if (!user) {
    return null; // This will be handled by the useEffect redirect
  }

  const contacts = userData?.emergencyContacts || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you would call an API to add the contact
      // For this example, we'll just update the local state
      const newContact = {
        id: Date.now().toString(),
        name,
        relationship,
        phoneNumber,
        isPrimary,
      };

      // If this is the primary contact, update other contacts
      let updatedContacts = [...contacts];
      if (isPrimary) {
        updatedContacts = updatedContacts.map((contact) => ({
          ...contact,
          isPrimary: false,
        }));
      }

      // Add the new contact
      updatedContacts.push(newContact);

      // Update user data
      updateUserData({
        ...userData,
        emergencyContacts: updatedContacts,
      });

      // Reset form
      setName("");
      setRelationship("");
      setPhoneNumber("");
      setIsPrimary(false);
    } catch (error) {
      console.error("Error adding emergency contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => {
              navigate("/profile");
            }}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-[#000000]">
            Emergency Contacts
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" required>
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
                      placeholder="Enter contact name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship" required>
                      Relationship
                    </Label>
                    <Select
                      value={relationship}
                      onValueChange={setRelationship}
                      required
                    >
                      <SelectTrigger
                        id="relationship"
                        className="h-12 border-[#d1d1d1] w-full"
                      >
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" required>
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
                      placeholder="+63 XXX XXX XXXX"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Label htmlFor="isPrimary" className="cursor-pointer">
                      Set as primary contact
                    </Label>
                    <Switch
                      id="isPrimary"
                      checked={isPrimary}
                      onCheckedChange={setIsPrimary}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#005dff] hover:bg-[#005dff]/90 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Contact
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <EmergencyContactsList contacts={contacts} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
