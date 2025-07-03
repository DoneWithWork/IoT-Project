"use client";

import { RevokeApiKeyAction } from "@/app/actions/RevokeApiKeyAction";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApiKeyExtend } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Copy, CopyCheck, Loader2, MoreHorizontal } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export const ApiKeysColumn: ColumnDef<ApiKeyExtend>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "initial",
    header: "Initial",
    cell: ({ row }) => {
      const value: string = row.getValue("initial");
      const text = "api_key_" + value + "....";
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
const initialState = { errors: {}, success: false };
const ActionsCell = ({ row }: { row: Row<ApiKeyExtend> }) => {
  const { user, isLoaded } = useUser();
  const [copied, setCopied] = useState(false);
  const [copyPending, SetCopyPending] = useState(false);
  const [state, action, pending] = useActionState(
    RevokeApiKeyAction,
    initialState
  );

  useEffect(() => {
    if (state?.errors && Object.keys(state.errors).length > 0) {
      toast("An error occurred revoking the API key!");
    }
  }, [state]);
  if (!isLoaded || !user) return null;
  const handleCopy = async () => {
    SetCopyPending(true);
    const response = await fetch(`/api/api-key/${row.original.id}`, {
      method: "GET",
      cache: "force-cache",
      next: { tags: [`api_keys:${user.id}`] },
    });
    SetCopyPending(false);
    if (!response.ok) return toast("Failed to copy API key");

    const data = await response.json();
    navigator.clipboard.writeText(data.api_key);
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
          <DropdownMenuItem>
            <form action={action}>
              <input
                name="api_key_id"
                value={row.original.id}
                hidden
                readOnly
              />
              <Button
                className="hover:cursor-pointer bg-red-500 hover:bg-red-600 text-white"
                disabled={pending}
              >
                {pending && <Loader2 className="animate-spin size-6" />}
                <span>Revoke</span>
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {copied ? (
        <CopyCheck
          className="size-5 hover:cursor-pointer text-green-500"
          size={20}
        />
      ) : copyPending ? (
        <Loader2 className="animate-spin size-5" />
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
