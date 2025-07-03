import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import NewProjectForm from "./forms/NewProjectForm";
import { Button } from "./ui/button";

export default async function NewProjectBtn() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="size-5" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>Create a new project</DialogDescription>
        </DialogHeader>
        <div>
          <NewProjectForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
