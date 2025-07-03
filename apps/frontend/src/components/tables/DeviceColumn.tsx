"use client";
import { DeleteDeviceAction } from "@/app/actions/DeleteDevice";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { initialState } from "@/lib/constants";
import { DeleteDeviceSchema } from "@/lib/schema";
import { Device } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Copy, CopyCheck, Eye } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteActionBtn from "../DeleteActionBtn";
import { useRouter } from "next/navigation";
export const DeviceColumn: ColumnDef<Device>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "deviceType",
    header: "Device Type",
  },
  {
    accessorKey: "deviceAuthToken",
    header: "Device Token",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center ">
          <span>{row.original.deviceAuthToken.substring(0, 15) + "..."}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

function Actions({ row }: { row: Row<Device> }) {
  const [copied, SetCopied] = useState(false);
  const [open, SetOpen] = useState(false);
  const [state, action, pending] = useActionState(
    DeleteDeviceAction,
    initialState
  );
  const router = useRouter();
  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([fieldName, errors]) => {
        if (fieldName in DeleteDeviceSchema.shape) {
          toast(errors.join(", "));
        }
      });
    }
    if (state?.formErrors) {
      toast(state?.formErrors);
    }
    if (state?.success) {
      SetOpen(false);
      toast("Successfully deleted device!");
      router.refresh();
    }
  }, [state, router]);
  return (
    <div className="flex flex-row items-center gap-3">
      <Button asChild className="bg-green-500 hover:bg-green-600">
        <Link
          href={`/dashboard/devices/${row.original.projectId}/${row.original.id}`}
        >
          <Eye className="size-4 text-white" />
        </Link>
      </Button>
      <DeleteActionBtn
        SetOpen={SetOpen}
        open={open}
        action={action}
        name="deviceId"
        value={row.original.id}
        pending={pending}
        deleteItemName="Device"
      />

      <Tooltip>
        <TooltipTrigger>
          {copied ? (
            <CopyCheck className="size-5 text-green-500" />
          ) : (
            <Copy
              className="size-5"
              onClick={() => {
                navigator.clipboard.writeText(row.original.deviceAuthToken);
                SetCopied(true);
                setTimeout(() => {
                  SetCopied(false);
                }, 2000);
                toast("Copied Device Auth Token");
              }}
            />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy Device Token</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
