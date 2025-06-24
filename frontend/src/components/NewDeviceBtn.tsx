import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchData } from "@/lib/data";
import { ProjectType } from "@/lib/types";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NewDeviceForm from "./forms/NewDeviceForm";
import { Button } from "./ui/button";
async function getAccessToken() {
  const cookiesStore = await cookies();
  return cookiesStore.get("sAccessToken")?.value;
}

export default async function NewDeviceBtn({ id }: { id: string | null }) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/auth");
  }
  const projects = await fetchData<ProjectType[]>(
    accessToken,
    "/api/user/projects",
    "projects"
  );
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
