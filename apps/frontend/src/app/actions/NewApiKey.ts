"use server"
import { encryptApiKey, generateApiKey } from "@/lib/apikey";
import { db } from "@repo/db";
import { ApiKeySchema } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

import { redirect } from "next/navigation";



export async function NewApiKeyAction(prevState: unknown, formData: FormData) {
    const user = await currentUser();
    if (!user) return redirect("/")

    const parsed = ApiKeySchema.safeParse({
        name: formData.get("name"),
        type: formData.get("type"),
    })
    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }
    const key = await generateApiKey();
    const encryptedKey = await encryptApiKey(key);

    const NewApiKey = await db.apiKey.create({
        data: {
            "name": parsed.data.name,
            "userId": user.id,
            "type": parsed.data.type,
            "key": encryptedKey,
            "initial": key.substring(0, 5)
        }
    })
    if (NewApiKey) {
        revalidateTag(`api_keys:${user.id}`)
        return redirect(`/dashboard/settings?tab=apikeys`)

    }
    else redirect('/')


}