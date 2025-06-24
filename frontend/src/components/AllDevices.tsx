import { fetchData } from "@/lib/data";
import { DevicesType } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NewDeviceBtn from "./NewDeviceBtn";
import { DataTable } from "./tables/data-table";
import { DeviceColumn } from "./tables/DeviceColumn";
async function getAccessToken() {
  const cookiesStore = await cookies();
  return cookiesStore.get("sAccessToken")?.value;
}

export default async function AllDevices() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/auth");
  }
  const devices = await fetchData<DevicesType[]>(
    accessToken,
    "/api/user/devices",
    "devices"
  );
  return (
    <div className="flex flex-col flex-1">
      {devices ? (
        <div>
          <DataTable
            CreateBtn={<NewDeviceBtn id={null} />}
            columns={DeviceColumn}
            data={devices}
            filterName="name"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col  flex-1">
          <p className="font-bold text-2xl">Devices</p>
          <p className="mb-3">Create a new device to get started</p>
          <NewDeviceBtn id={null} />
        </div>
      )}
    </div>
  );
}
