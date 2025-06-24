"use server"

import { DeviceSchema } from "@/lib/schema";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
async function getAccessToken() {
    const cookiesStore = await cookies();
    return cookiesStore.get("sAccessToken")?.value;
}
export async function NewDeviceActions(prevState: unknown, formData: FormData) {

    const parsed = DeviceSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        deviceType: formData.get("deviceType"),
        projectId: formData.get("projectId")

    })
    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }
    const accessToken = await getAccessToken();
    const newProject = await fetch('http://localhost:8080/api/user/new-device', {
        method: "POST",
        headers: {

            Authorization: 'Bearer ' + accessToken,
            "Content-Type": "application/json", // <-- REQUIRED!

        },
        body: JSON.stringify(parsed.data)
    });

    if (newProject.ok) {
        const device = await newProject.json()
        revalidateTag('devices')
        revalidateTag(`devices_for_project_${parsed.data.projectId}`)
        redirect(`/dashboard/devices/${parsed.data.projectId}/${device.new_device.id}`)
    }
    if (newProject.status === 401) {
        redirect('/auth')
    }
    return { success: true, errors: {} }

}