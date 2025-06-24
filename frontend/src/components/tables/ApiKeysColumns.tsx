"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApiKeyType } from "@/lib/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Copy, CopyCheck, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
export const ApiKeysColumn: ColumnDef<ApiKeyType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "key",
    header: "Key",
    cell: ({ row }) => {
      const value: string = row.getValue("key");
      const text = value.substring(0, 5) + "....";
      return <div className="font-medium">{text}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Access Type",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt")).toDateString();
      return <div className="font-medium">{date}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
const ActionsCell = ({ row }: { row: Row<ApiKeyType> }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(row.original.key);
    setCopied(true);
    toast("Successfully copied API key");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-row items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Revoke</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {copied ? (
        <CopyCheck
          className="size-5 hover:cursor-pointer text-green-500"
          size={20}
        />
      ) : (
        <Copy
          className="size-5 hover:cursor-pointer"
          size={20}
          onClick={handleCopy}
        />
      )}
    </div>
  );
};
