"use server"

import { formSchema } from "@/lib/schema";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
async function getAccessToken() {
    const cookiesStore = await cookies();
    return cookiesStore.get("sAccessToken")?.value;
}
export async function NewProjectAction(values: z.infer<typeof formSchema>) {
    const accessToken = await getAccessToken();
    const newProject = await fetch('http://localhost:8080/api/user/new-project', {
        method: "POST",
        headers: {
            Authorization: 'Bearer ' + accessToken,
            "Content-Type": "application/json", // <-- REQUIRED!

        },
        body: JSON.stringify(values)
    });
    if (newProject.ok) {
        const response = await newProject.json()
        revalidateTag("projects");
        redirect(`/dashboard/projects/${response.id}`)
    }
    if (newProject.status === 401) {
        redirect('/auth')
    }



}