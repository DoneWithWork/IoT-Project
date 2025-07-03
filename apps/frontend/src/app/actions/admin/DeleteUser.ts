// "use server"

// import { checkRole } from "@/lib/roles"
// import { clerkClient } from "@clerk/nextjs/server"

// export async function DeleteUserActionAdmin(prevState: unknown, formData: FormData) {
//     const client = await clerkClient()

//     // Check that the user trying to set the role is an admin
//     if (!checkRole('superadmin')) {
//         return { formError: 'Not Authorized', success: false }
//     }


// }