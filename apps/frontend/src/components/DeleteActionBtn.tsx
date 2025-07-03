import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";

type DeleteActionBtnType = {
  action: (payload: FormData) => void;
  SetOpen: Dispatch<SetStateAction<boolean>>;
  pending: boolean;
  open: boolean;
  deleteItemName: string;
  name: string;
  value: string;
};
export default function DeleteActionBtn({
  action,
  SetOpen,
  pending,
  open,
  deleteItemName,
  name,
  value,
}: DeleteActionBtnType) {
  return (
    <Dialog onOpenChange={() => SetOpen(!open)} open={open}>
      <DialogTrigger asChild>
        <Button className="bg-red-500 hover:bg-red-600">
          <Trash className="size-4 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>

          <form action={action}>
            <input hidden readOnly name={name} value={value} />
            <Button
              disabled={pending}
              variant={"destructive"}
              className="mt-4 cursor-pointer"
            >
              {pending && <Loader2 className="animate-spin size-6" />}
              Delete {deleteItemName}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
