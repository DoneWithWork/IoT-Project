"use server"

import { ApiKeySchema } from "@/lib/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
async function getAccessToken() {
    const cookiesStore = await cookies();
    return cookiesStore.get("sAccessToken")?.value;
}
export async function NewApiKeyAction(prevState: unknown, formData: FormData) {

    const parsed = ApiKeySchema.safeParse({
        name: formData.get("name"),
        type: formData.get("type"),
    })
    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }
    const accessToken = await getAccessToken();

    const newProject = await fetch('http://localhost:8080/api/user/new-api-key', {
        method: "POST",
        headers: {
            /**
             * We read the access token from the cookies and use that as a Bearer token when
             * making network requests.
             */
            Authorization: 'Bearer ' + accessToken,
            "Content-Type": "application/json", // <-- REQUIRED!

        },
        body: JSON.stringify(parsed.data)
    });
    if (newProject.ok) {
        redirect(`/dashboard/settings?tab=apikeys`)
    }
    if (newProject.status === 401) {
        redirect('/auth')
    }


}