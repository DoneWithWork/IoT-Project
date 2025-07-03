import { User } from "@prisma/client";
import React from "react";
import { DataTable } from "../tables/data-table";
import { AdminUsersColumns } from "../tables/AdminUsersColumns";

export default function Users({ users }: { users: User[] }) {
  return (
    <DataTable
      columns={AdminUsersColumns}
      data={users}
      filterName="username"
    ></DataTable>
  );
}
