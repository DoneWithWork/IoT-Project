import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
export default function NewProjectBtn() {
  return (
    <Button asChild className="">
      <Link href={"/dashboard/projects/new"}>
        <Plus className="size-5" />
        Create Project
      </Link>
    </Button>
  );
}
