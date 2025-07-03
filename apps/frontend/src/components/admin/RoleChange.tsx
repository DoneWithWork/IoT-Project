"use client";
import { UpdateUserRoleActionAdmin } from "@/app/actions/admin/UpdateUserRoleAdmin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWarnIfUnsavedChanges } from "@/hooks/use-prevent-unsaved-transition";
import { UserRoleSchema } from "@/lib/schema";
import { User } from "@repo/db";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
const initialState = { errors: {}, success: false, formError: "" };
type RoleTypeForm = {
  success: boolean;
  errors: Record<string, string[]>;
  formError: string;
};
export default function RoleChange({ user }: { user: User }) {
  const [changed, SetChanges] = useState(false);
  const selectRef = useRef<HTMLButtonElement>(null);
  const [state, action, pending] = useActionState<RoleTypeForm, FormData>(
    UpdateUserRoleActionAdmin,
    initialState
  );
  const handleFocus = () => {
    selectRef.current?.focus();
  };

  useWarnIfUnsavedChanges(changed, () => {
    return confirm("Warning! You have unsaved changes.");
  });
  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([fieldName, errors]) => {
        if (fieldName in UserRoleSchema.shape) {
          toast(errors.join(", "));
        }
      });
    }
    if (state?.formError) {
      toast(state.formError);
    }
    if (state?.success) {
      toast("Successfully changed role!");
    }
  }, [pending, state]);
  return (
    <div>
      <form action={action} className="space-y-3">
        <Label htmlFor="">Role</Label>
        <div className="flex flex-row items-center gap-3">
          <Select
            name="role"
            defaultValue={user.role}
            onValueChange={(value) => {
              if (user.role !== value) {
                toast("You have unsaved changes!");
                setTimeout(() => {
                  handleFocus(); // runs *after* dropdown UI finishes
                }, 100);
                SetChanges(true);
              } else SetChanges(false);
            }}
          >
            <SelectTrigger>
              <SelectValue defaultValue={user.role} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="educator">Educator</SelectItem>
              <SelectItem value="superadmin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
          <Input value={user.id} name="userId" hidden readOnly />
          <Button ref={selectRef} disabled={!changed || pending}>
            {pending && <Loader2 className="animate-spin size-6" />}
            Update Role
          </Button>
        </div>
      </form>
    </div>
  );
}
