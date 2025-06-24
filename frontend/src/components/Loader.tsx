import { Loader2Icon } from "lucide-react";

export function LoadingCom() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <Loader2Icon className="animate-spin size-10" />
    </div>
  );
}
