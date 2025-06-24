"use client";

import { DataStreamType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
export const DataStreamColumn: ColumnDef<DataStreamType>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({}) => {
      return (
        <div className="flex flex-row items-center gap-3">
          {/* <Tooltip>
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
          </Button> */}
        </div>
      );
    },
  },
];
