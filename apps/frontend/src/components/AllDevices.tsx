import { Device } from "@repo/db";
import NewDeviceBtn from "./NewDeviceBtn";
import { DataTable } from "./tables/data-table";
import { DeviceColumn } from "./tables/DeviceColumn";

export default async function AllDevices({ devices }: { devices: Device[] }) {
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
