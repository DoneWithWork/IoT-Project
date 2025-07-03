import { db } from "@repo/db";
import React from "react";

export default async function UserDashboard() {
  const users = await db.user.findMany();
  return (
    <div>
      {users.map((user, index) => (
        <div key={index}>{user.email}</div>
      ))}
    </div>
  );
}
