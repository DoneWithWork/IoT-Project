import Header from "@/components/Header";
import AllProjects from "@/components/Projects";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";

export default async function Projects() {
  return (
    <div className="px-3 py-3 flex flex-col min-h-screen">
      <Header classnames="mb-2">Projects</Header>
      <div className="bg-gray-900  w-full flex-1 rounded-md px-3 py-3 flex flex-col">
        <Suspense fallback={<LoadingCom />}>
          <AllProjects />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingCom() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <Loader2Icon className="animate-spin size-10" />
    </div>
  );
}
