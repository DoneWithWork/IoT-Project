import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Device } from "@repo/db";
import { Plus } from "lucide-react";
import NewDataStreamForm from "./forms/NewDataStreamForm";
import { Button } from "./ui/button";

export default async function NewDataStreamBtn({
  devices,
}: {
  devices: Device[];
}) {
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
