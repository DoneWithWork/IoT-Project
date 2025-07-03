"use client";

import { DeleteDataStreamAction } from "@/app/actions/DeleteDataStreamAction";
import { initialState } from "@/lib/constants";
import { DeleteDataStreamSchema } from "@/lib/schema";
import { DataStream } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteActionBtn from "../DeleteActionBtn";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
export const DataStreamColumn: ColumnDef<DataStream>[] = [
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
    cell: ({ row }) => {
      return <Action row={row} />;
    },
  },
];
function Action({ row }: { row: Row<DataStream> }) {
  const [open, SetOpen] = useState(false);
  const [state, action, pending] = useActionState(
    DeleteDataStreamAction,
    initialState
  );
  const router = useRouter();
  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([fieldName, errors]) => {
        if (fieldName in DeleteDataStreamSchema.shape) {
          toast(errors.join(", "));
        }
      });
    }

    if (state?.formErrors) {
      toast(state.formErrors);
    }

    if (state?.success) {
      SetOpen(false); // Close modal immediately
      toast("Successfully deleted data stream!");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="flex flex-row items-center gap-3">
      <Button asChild className="bg-green-500 hover:bg-green-600">
        <Link href={`/dashboard/devices/datastream`}>
          <Eye className="size-4 text-white" />
        </Link>
      </Button>
      <DeleteActionBtn
        deleteItemName="Data Stream"
        SetOpen={SetOpen}
        open={open}
        action={action}
        name="dataStreamId"
        value={row.original.id}
        pending={pending}
      />
    </div>
  );
}
