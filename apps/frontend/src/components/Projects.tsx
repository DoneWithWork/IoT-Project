import { Button } from "@/components/ui/button";
import { getCachedProjects } from "@/lib/data";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import NewProjectBtn from "./NewProjectBtn";
import { DataTable } from "./tables/data-table";
import { ProjectColumn } from "./tables/ProjectColumns";

export default async function AllProjects() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }
  const projects = await getCachedProjects(userId);
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
