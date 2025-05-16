import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileSummaryProps {
  user: {
    name: string;
    email: string;
    joinDate: string;
    stats: {
      daysActive: number;
      workoutsCompleted: number;
      caloriesBurned: number;
    };
  };
}

export function ProfileSummary({ user }: ProfileSummaryProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-end">
        <div className="flex items-end">
          <Avatar className="h-20 w-20 border-4 border-white shadow-md ">
            <AvatarImage
              src="/placeholder.svg?height=80&width=80"
              alt={user.name}
            />
            <AvatarFallback className="bg-[#e6f0ff] text-[#005dff] text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
