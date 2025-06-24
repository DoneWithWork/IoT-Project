import AllDevices from "@/components/AllDevices";
import Header from "@/components/Header";
import { LoadingCom } from "@/components/Loader";
import { Suspense } from "react";

export default async function Projects() {
  return (
    <div className="px-3 py-3 flex flex-col min-h-screen">
      <Header classnames="mb-2">Devices</Header>
      <div className="bg-gray-900  w-full flex-1 rounded-md px-3 py-3 flex flex-col">
        <Suspense fallback={<LoadingCom />}>
          <AllDevices />
        </Suspense>
      </div>
    </div>
  );
}
