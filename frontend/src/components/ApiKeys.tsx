import { ApiKeyType } from "@/lib/types";
import { cookies } from "next/headers";
import React from "react";
import { DataTable } from "./tables/data-table";
import { ApiKeysColumn } from "./tables/ApiKeysColumns";
import NewApiKeyBtn from "./NewApiKeyBtn";

async function getAccessToken() {
  const cookiesStore = await cookies();
  return cookiesStore.get("sAccessToken")?.value;
}
async function fetchAllApiKeys() {
  const accessToken = await getAccessToken();

  const response = await fetch("http://localhost:8080/api/user/api-keys", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
  }
  const data = await response.json();
  const keys: ApiKeyType[] = data.api_keys;
  return keys;
}
export default async function ApiKeys() {
  const ApiKeys = await fetchAllApiKeys();
  return (
    <DataTable
      CreateBtn={<NewApiKeyBtn />}
      columns={ApiKeysColumn}
      filterName="name"
      data={ApiKeys}
    ></DataTable>
  );
}
