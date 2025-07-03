'use server'

import { checkRole } from "@/lib/roles"
import { clerkClient } from '@clerk/nextjs/server'

export async function setRole(formData: FormData) {
    const client = await clerkClient()

    // Check that the user trying to set the role is an admin
    if (!checkRole('superadmin')) {
        // return { message: 'Not Authorized' }
    }

    try {
        await client.users.updateUserMetadata(formData.get('id') as string, {
            publicMetadata: { role: formData.get('role') },
        })
        // return { message: res.publicMetadata }
    } catch {
        // return { message: err }
    }
}

export async function removeRole(formData: FormData) {
    const client = await clerkClient()

    try {
        await client.users.updateUserMetadata(formData.get('id') as string, {
            publicMetadata: { role: null },
        })
        // return { message: res.publicMetadata }
    } catch {
        // return { message: err }
    }
}