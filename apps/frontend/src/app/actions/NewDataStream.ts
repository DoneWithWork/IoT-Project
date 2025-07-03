"use server"

import { db } from "@repo/db";
import { DataStreamSchema } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function NewDataStreamAction(prevState: unknown, formData: FormData) {
    const user = await currentUser();

    if (!user) return redirect("/")
    const parsed = DataStreamSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        deviceId: formData.get("deviceId"),
        projectId: formData.get("projectId"),
    })
    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }
    const { projectId, deviceId, description, title } = parsed.data
    const Device = await db.device.findFirst({
        where: {
            id: deviceId,
            Project: {
                userId: user.id,
                id: projectId
            }
        }
    })
    if (!Device) return { errors: {}, success: false, formErrors: 'Cannot find device!' }
    const newDataStream = await db.dataStream.create({
        data: {
            title,
            description,
            deviceId,

        }
    })
    if (newDataStream) {
        revalidateTag(`data_stream:${user.id}:${projectId}`)
        redirect(`/dashboard/projects/${projectId}/?tab=data_stream`)
    } else {
        return { success: false, errors: {}, formErrors: "Failed to create data stream" }
    }



}