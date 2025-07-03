"use client";

import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
export const AdminUsersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-3">
          <Tooltip>
            <TooltipTrigger>
              <Button asChild className="bg-green-500 hover:bg-green-600">
                <Link href={`/admin/users/${row.original.id}`}>
                  <Eye className="size-4 text-white font-bold" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View User</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];
