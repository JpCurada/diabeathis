import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Star, Edit, Trash2, Save } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  isPrimary: boolean;
}

interface EmergencyContactsListProps {
  contacts: EmergencyContact[];
}

export function EmergencyContactsList({
  contacts,
}: EmergencyContactsListProps) {
  const { userData, updateUserData } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [contactToEdit, setContactToEdit] = useState<EmergencyContact | null>(
    null
  );
  const [editedName, setEditedName] = useState("");
  const [editedRelationship, setEditedRelationship] = useState("");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState("");
  const [editedIsPrimary, setEditedIsPrimary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleDelete = (contactId: string) => {
    setContactToDelete(contactId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!contactToDelete) return;

    // Filter out the contact to delete
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactToDelete
    );

    // Update user data
    updateUserData({
      ...userData,
      emergencyContacts: updatedContacts,
    });

    setDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  const handleEdit = (contact: EmergencyContact) => {
    setContactToEdit(contact);
    setEditedName(contact.name);
    setEditedRelationship(contact.relationship);
    setEditedPhoneNumber(contact.phoneNumber);
    setEditedIsPrimary(contact.isPrimary);
    setSaveSuccess(false);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!contactToEdit) return;

    setIsSubmitting(true);
    setSaveSuccess(false);

    try {
      // Update the contact in the list
      const updatedContacts = contacts.map((contact) => {
        if (contact.id === contactToEdit.id) {
          return {
            ...contact,
            name: editedName,
            relationship: editedRelationship,
            phoneNumber: editedPhoneNumber,
            isPrimary: editedIsPrimary,
          };
        }

        // If this is the primary contact, update other contacts
        if (editedIsPrimary && contact.id !== contactToEdit.id) {
          return {
            ...contact,
            isPrimary: false,
          };
        }

        return contact;
      });

      // Update user data
      updateUserData({
        ...userData,
        emergencyContacts: updatedContacts,
      });

      setSaveSuccess(true);

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setEditDialogOpen(false);
        setContactToEdit(null);
      }, 1500);
    } catch (error) {
      console.error("Error updating emergency contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="text-center py-8">
        <Phone className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No emergency contacts
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding an emergency contact.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <Card key={contact.id} className="p-4 border-[#d1d1d1]">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#005dff]/10 flex items-center justify-center text-[#005dff]">
                <Phone size={18} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-[#000000]">{contact.name}</h3>
                  {contact.isPrimary && (
                    <Badge className="bg-[#005dff]">
                      <Star className="mr-1 h-3 w-3" />
                      Primary
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-[#747474]">{contact.relationship}</p>
                <p className="text-sm font-medium mt-1">
                  {contact.phoneNumber}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 self-end sm:self-start">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#747474] hover:text-[#005dff] hover:bg-[#005dff]/10"
                onClick={() => handleEdit(contact)}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#747474] hover:text-red-500 hover:bg-red-50"
                onClick={() => handleDelete(contact.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[95vw] w-full sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Emergency Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this emergency contact? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Contact Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-[95vw] w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Emergency Contact</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {saveSuccess && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>
                  Contact updated successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-name" required>
                Full Name
              </Label>
              <Input
                id="edit-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
                placeholder="Enter contact name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-relationship" required>
                Relationship
              </Label>
              <Select
                value={editedRelationship}
                onValueChange={setEditedRelationship}
                required
              >
                <SelectTrigger
                  id="edit-relationship"
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
              <Label htmlFor="edit-phoneNumber" required>
                Phone Number
              </Label>
              <Input
                id="edit-phoneNumber"
                value={editedPhoneNumber}
                onChange={(e) => setEditedPhoneNumber(e.target.value)}
                className="h-12 border-[#d1d1d1] focus:border-[#005dff] focus:ring-[#005dff]/20"
                placeholder="+63 XXX XXX XXXX"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="edit-isPrimary" className="cursor-pointer">
                Set as primary contact
              </Label>
              <Switch
                id="edit-isPrimary"
                checked={editedIsPrimary}
                onCheckedChange={setEditedIsPrimary}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                onClick={handleSaveEdit}
                className="bg-[#005dff] hover:bg-[#005dff]/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
