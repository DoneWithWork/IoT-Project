import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchData } from "@/lib/data";
import { DevicesType } from "@/lib/types";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NewDataStreamForm from "./forms/NewDataStreamForm";
import { Button } from "./ui/button";

async function getAccessToken() {
  const cookiesStore = await cookies();
  return cookiesStore.get("sAccessToken")?.value;
}
export default async function NewDataStreamBtn({
  projectId,
}: {
  projectId: string;
}) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/auth");
  }
  const devices = await fetchData<DevicesType[]>(
    accessToken,
    `/api/user/devices/${projectId}`,
    `devices_for_project_${projectId}`
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="size-5" />
          New Data Stream
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Data Stream</DialogTitle>
          <DialogDescription>
            Create a new data stream to control and store your data
          </DialogDescription>
        </DialogHeader>
        <div>
          <NewDataStreamForm devices={devices} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
