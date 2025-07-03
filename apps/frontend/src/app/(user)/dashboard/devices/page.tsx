import AllDevices from "@/components/AllDevices";
import Header from "@/components/Header";
import { LoadingCom } from "@/components/Loader";
import { getCachedDevices } from "@/lib/data";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Projects() {
  const user = await currentUser();
  if (!user) return redirect("/");
  const devices = await getCachedDevices(user.id);

  return (
    <div className="px-3 py-3 flex flex-col min-h-screen">
      <Header classnames="mb-2">Devices</Header>
      <div className="bg-gray-900  w-full flex-1 rounded-md px-3 py-3 flex flex-col">
        <Suspense fallback={<LoadingCom />}>
          <AllDevices devices={devices} />
        </Suspense>
      </div>
    </div>
  );
}
