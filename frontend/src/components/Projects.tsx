import { Button } from "@/components/ui/button";
import { fetchData } from "@/lib/data";
import { ProjectType } from "@/lib/types";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import NewProjectBtn from "./NewProjectBtn";
import { DataTable } from "./tables/data-table";
import { ProjectColumn } from "./tables/ProjectColumns";
async function getAccessToken() {
  const cookiesStore = await cookies();
  return cookiesStore.get("sAccessToken")?.value;
}

export default async function AllProjects() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/auth");
  }
  const projects = await fetchData<ProjectType[]>(
    accessToken,
    "/api/user/projects",
    "projects"
  );
  return (
    <div>
      {projects ? (
        <div>
          <DataTable
            CreateBtn={<NewProjectBtn />}
            columns={ProjectColumn}
            data={projects}
            onClick={true}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col  flex-1">
          <p className="font-bold text-2xl">Projects</p>
          <p>Create a new project to get started</p>
          <Button asChild className="mt-3">
            <Link href={"/dashboard/projects/new"}>
              <Plus className="size-5" />
              Create Project
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
