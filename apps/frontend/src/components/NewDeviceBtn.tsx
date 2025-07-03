import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCachedProjects } from "@/lib/data";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import NewDeviceForm from "./forms/NewDeviceForm";
import { Button } from "./ui/button";

export default async function NewDeviceBtn({ id }: { id: string | null }) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const projects = await getCachedProjects(userId);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="size-5" />
          New Device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Device</DialogTitle>
          <DialogDescription>Create a new Iot device</DialogDescription>
        </DialogHeader>
        <div>
          <NewDeviceForm id={id} projects={projects} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
