"use client";

import { DevicesType } from "@/lib/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Copy, CopyCheck, Eye, Folder } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
export const DeviceColumn: ColumnDef<DevicesType>[] = [
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
      <Actions row={row} />;
    },
  },
];

function Actions({ row }: { row: Row<DevicesType> }) {
  const [copied, SetCopied] = useState(false);
  useEffect(() => {}, []);
  return (
    <div className="flex flex-row items-center gap-3">
      <Tooltip>
        <TooltipTrigger>
          <Button asChild className="bg-yellow-500 hover:bg-yellow-600">
            <Link href={`/dashboard/projects/${row.original.projectId}`}>
              <Folder className="size-4 text-white font-bold" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Go to project</p>
        </TooltipContent>
      </Tooltip>

      <Button asChild className="bg-green-500 hover:bg-green-600">
        <Link
          href={`/dashboard/devices/${row.original.projectId}/${row.original.id}`}
        >
          <Eye className="size-4 text-white" />
        </Link>
      </Button>
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
