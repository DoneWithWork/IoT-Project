"use server"

import { postData } from "@/lib/data";
import { DataStreamSchema } from "@/lib/schema";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
async function getAccessToken() {
    const cookiesStore = await cookies();
    return cookiesStore.get("sAccessToken")?.value;
}
export async function NewDataStreamAction(prevState: unknown, formData: FormData) {

    const parsed = DataStreamSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        deviceId: formData.get("deviceId"),
        projectId: formData.get("projectId"),
    })
    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }
    const accessToken = await getAccessToken();
    if (!accessToken) {
        redirect("/auth")
    }
    const newDataStream = await postData(accessToken, "/api/user/new-data-stream", parsed.data)
    console.log(newDataStream.status)
    if (newDataStream.ok) {
        revalidateTag(`data_streams_${parsed.data.projectId}`)
        redirect(`/dashboard/projects/${parsed.data.projectId}/?tab=data_stream`)
    }



}