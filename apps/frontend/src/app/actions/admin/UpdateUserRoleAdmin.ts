"use server"

import { db } from "@repo/db";
import { checkRole } from "@/lib/roles"
import { UserRoleSchema } from "@/lib/schema"
import { clerkClient } from "@clerk/nextjs/server"
import { revalidateTag } from "next/cache"

export async function UpdateUserRoleActionAdmin(prevState: unknown, formData: FormData) {
    const client = await clerkClient()

    if (!await checkRole('superadmin')) {
        return { formError: 'Not Authorized', success: false, errors: {} }
    }

    const parsed = UserRoleSchema.safeParse({
        role: formData.get("role"),
        userId: formData.get("userId")

    })
    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors, success: false, formError: "" }
    }
    const { userId, role } = parsed.data
    const user = await db.user.findFirst({
        where: {
            id: userId
        }
    })
    if (!user) return { errors: {}, success: false, formError: "Failed to find user!" }
    if (user.role === role) return { errors: {}, success: false, formError: "Role did not change" }
    const updatedUser = await db.user.update({
        where: {
            id: userId
        },
        data: {
            role
        }
    })
    await client.users.updateUserMetadata(updatedUser.id, {
        publicMetadata: { role },
    })
    revalidateTag(`admin:user:${userId}`)
    return { errors: {}, success: true, formError: "" }
}