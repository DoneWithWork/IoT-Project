"use server"

import { generateApiKey } from "@/lib/apikey";
import { db } from "@repo/db";
import { DeviceSchema } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function NewDeviceActions(prevState: unknown, formData: FormData) {
    const user = await currentUser();

    if (!user) return redirect("/")
    const parsed = DeviceSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        deviceType: formData.get("deviceType"),
        projectId: formData.get("projectId")

    })
    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors, success: false }
    }
    const { name, description, deviceType, projectId } = parsed.data

    const Project = await db.project.findFirst({
        where: {
            userId: user.id,
            id: projectId
        }
    })
    if (!Project) return { success: false, errors: {} }
    const key = await generateApiKey();
    const token = `${(Project.title).toLocaleLowerCase().replace(" ", "_")}_auth_token_${key}`
    const newDevice = await db.device.create({
        data: {
            name,
            description,
            deviceType,
            projectId,
            deviceAuthToken: token
        }
    })

    if (newDevice) {
        revalidateTag(`devices:${user.id}`)
        revalidateTag(`project_devices:${user.id}:${projectId}`)
        redirect(`/dashboard/devices/${parsed.data.projectId}/${newDevice.id}`)
    }
    else {
        return { success: false, errors: {} }
    }

}