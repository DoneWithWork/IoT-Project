import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { fetchData } from "@/lib/data";
import { DevicesType } from "@/lib/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
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
  const {isAuthenticated,getUser} = await getKindeServerSession()
  const user = await getUser();
  if(!isAuthenticated || !user){
    redirect("/api/auth/login")
  }
    
  const device = 
  // const device = await fetchData<DevicesType>(
  //   accessToken,
  //   `/api/user/device/${projectId}/${deviceId}`,
  //   "device"
  // );
  return (
    <div className="px-3 py-3">
      <Header>Device: {device.name}</Header>
      <Separator className="mt-3" />
    </div>
  );
}
