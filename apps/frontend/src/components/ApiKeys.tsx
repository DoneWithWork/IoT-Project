import { getCachedApiKeys } from "@/lib/data";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NewApiKeyBtn from "./NewApiKeyBtn";
import { ApiKeysColumn } from "./tables/ApiKeysColumns";
import { DataTable } from "./tables/data-table";

export default async function ApiKeys() {
  const user = await currentUser();
  if (!user) return redirect("/");
  const Apikeys = await getCachedApiKeys(user?.id);
  return (
    <DataTable
      CreateBtn={<NewApiKeyBtn />}
      columns={ApiKeysColumn}
      filterName="name"
      data={Apikeys}
    ></DataTable>
  );
}
