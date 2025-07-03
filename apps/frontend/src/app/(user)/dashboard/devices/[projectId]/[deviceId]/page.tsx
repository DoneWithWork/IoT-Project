import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { getCachedDevice } from "@/lib/data";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DevicePage({
  params,
}: {
  params: Promise<{ deviceId: string; projectId: string }>;
}) {
  const { deviceId } = await params;
  const user = await currentUser();
  if (!user) return redirect("/");
  const userId = user.id;
  const device = await getCachedDevice({ deviceId, userId });
  if (!device) redirect("/dashboard/projects");
  return (
    <div className="px-3 py-3">
      <Header>Device: {device.name}</Header>
      <Separator className="mt-3" />
    </div>
  );
}
