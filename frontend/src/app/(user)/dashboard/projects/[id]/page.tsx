import Header from "@/components/Header";
import { LoadingCom } from "@/components/Loader";
import NewDeviceBtn from "@/components/NewDeviceBtn";
import Project from "@/components/Project";
import { fetchData } from "@/lib/data";
import { DataStreamType, DevicesType, ProjectType } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
async function getAccessToken() {
  const cookiesStore = await cookies();
  return cookiesStore.get("sAccessToken")?.value;
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const parameters = await searchParams;

  const tab = typeof parameters.tab === "string" ? parameters.tab : "dashboard";
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/auth");
  }
  const project: ProjectType = await fetchData(
    accessToken,
    `/api/user/project/${id}`,
    "project"
  );
  const dataStreams = await fetchData<DataStreamType[]>(
    accessToken,
    `/api/user/data-streams/${id}`,
    `data_streams_${id}`
  );
  const devices = await fetchData<DevicesType[]>(
    accessToken,
    `/api/user/devices/${id}`,
    `devices_for_project_${id}`
  );
  console.log(dataStreams);
  return (
    <div className="px-3 py-3 flex flex-col h-screen max-w-full">
      <div className="flex flex-row justify-between items-center ">
        <div>
          <Header>Project: {project.title}</Header>
          <p className="text-base mb-3 ">{project.description}</p>
        </div>
        <div>
          <NewDeviceBtn id={project.id} />
        </div>
      </div>
      <Suspense fallback={<LoadingCom />}>
        <Project
          project={project}
          tab={tab}
          dataStreams={dataStreams}
          devices={devices}
        />
      </Suspense>
      <div className="mt-3"></div>
    </div>
  );
}
