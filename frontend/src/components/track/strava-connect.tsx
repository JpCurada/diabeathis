import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface StravaConnectProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StravaConnect({ isOpen, onOpenChange }: StravaConnectProps) {
  const isMobile = useIsMobile();

  const connectContent = (
    <Button className="bg-[#00B0B9] hover:bg-[#00B0B9]/90 w-full">
      Connect Fitbit
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full">
            Connect Fitness Device
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Connect Fitness Device</DrawerTitle>
            <DrawerDescription>
              Link your fitness accounts to sync your activities
            </DrawerDescription>
          </DrawerHeader>

          {connectContent}

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Connect Fitness Device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Fitness Device</DialogTitle>
          <DialogDescription>
            Link your fitness accounts to sync your activities
          </DialogDescription>
        </DialogHeader>

        {connectContent}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
