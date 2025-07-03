"use server"

import { db } from "@repo/db";
import { DeleteDeviceSchema } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";

export async function DeleteDeviceAction(prevState: unknown, formData: FormData) {
    const user = await currentUser();

    if (!user) redirect("/")
    const parsed = DeleteDeviceSchema.safeParse({
        deviceId: formData.get("deviceId")
    })
    if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors, success: false, formErrors: "" }
    const userId = user.id;
    const device = await db.device.findFirst({
        where: {
            id: parsed.data.deviceId,
            Project: {
                userId
            }
        },
        include: {
            dataStreams: true
        }
    })

    if (!device) return { errors: {}, success: false, formErrors: "Failed to delete device" }
    if (device?.dataStreams.length != null && device.dataStreams.length > 0) {
        return { errors: {}, success: false, formErrors: "You must deleted all data streams for this device first." }

    }
    const deletedDevice = await db.device.delete({
        where: {
            id: parsed.data.deviceId
        }
    });

    if (!deletedDevice) return { errors: {}, success: false, formErrors: "Failed to delete device" }
    after(() => { revalidateTag(`project_devices:${userId}:${device.projectId}`) })

    return { errors: {}, success: true, formErrors: "" }


}