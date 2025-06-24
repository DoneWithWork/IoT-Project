import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { fetchData } from "@/lib/data";
import { DevicesType } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
async function getAccessToken() {
  const cookiesStore = await cookies();
  return cookiesStore.get("sAccessToken")?.value;
}
export default async function DevicePage({
  params,
}: {
  params: Promise<{ deviceId: string; projectId: string }>;
}) {
  const { deviceId, projectId } = await params;
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/auth");
  }
  const device = await fetchData<DevicesType>(
    accessToken,
    `/api/user/device/${projectId}/${deviceId}`,
    "device"
  );
  return (
    <div className="px-3 py-3">
      <Header>Device: {device.name}</Header>
      <Separator className="mt-3" />
    </div>
  );
}
