"use client";
import { DeleteAccountAction } from "@/app/actions/DeleteAccount";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClerk } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const initialState = { error: false, message: "" };

export default function DeleteAccount() {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const { signOut } = useClerk();
  const [state, action] = useActionState(DeleteAccountAction, initialState);

  const phrase = "DELETE ACCOUNT";

  // Add useEffect to handle state changes
  useEffect(() => {
    if (state.message) {
      toast(state.message);
      if (!state.error) {
        setTimeout(async () => {
          await signOut();
        }, 1500);
      }
    }
  }, [state, signOut]);

  async function handleDeleteAccount() {
    if (value !== phrase) {
      toast("Please type in correct delete phrase");
      return;
    }

    startTransition(async () => {
      await action();
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-red-500 dark:text-white hover:bg-red-600 hover:cursor-pointer">
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="">
            <span className="block">
              This action cannot be undone. This will permanently delete your
              account and remove all data from our servers.
            </span>
            <span className="my-4 block">
              Please type in{" "}
              <span className="font-bold text-yellow-500 text-xl bg-black">
                DELETE ACCOUNT
              </span>{" "}
              to delete you account
            </span>
            <Input onChange={(e) => setValue(e.target.value)} />
            <Button
              disabled={isPending}
              onClick={handleDeleteAccount}
              className="bg-red-500 dark:text-white hover:bg-red-600 mt-6 font-bold hover:cursor-pointer"
            >
              <span>Confirm</span>
              {isPending && <Loader2 className="animate-spin size-6 ml-2" />}
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
