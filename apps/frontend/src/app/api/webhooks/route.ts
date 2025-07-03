import { db } from "@repo/db";
import { clerkClient } from '@clerk/nextjs/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    const client = await clerkClient();
    try {
        const evt = await verifyWebhook(req)

        // Do something with payload
        // For this guide, log payload to console
        const { id } = evt.data
        const eventType = evt.type
        console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
        console.log('Webhook payload:', evt.data)

        if (eventType === "user.created") {
            const user = await db.user.create({
                data: {
                    "id": evt.data.id,
                    "profile": evt.data.image_url,
                    "username": evt.data.username || (evt.data.first_name! + " " + evt.data.last_name!),
                    "email": evt.data.email_addresses[0]['email_address']

                }
            })
            await client.users.updateUserMetadata(evt.data.id, {
                publicMetadata: {
                    "role": "student"
                },
            })
            if (!user) {
                console.error("Failed in creating new user")
                redirect("/")
            }
        }
        else if (eventType === 'user.updated') {
            const user = await db.user.findFirst({
                where: {
                    id: evt.data.id
                }
            })
            if (!user) {
                console.error("Could not find user to update.")
                redirect("/")
            }
            const updatedUser = await db.user.update({
                where: {
                    id: evt.data.id
                },
                data: {
                    "profile": evt.data.image_url,
                    "username": evt.data.username || (evt.data.first_name! + " " + evt.data.last_name!),
                    "email": evt.data.email_addresses[0]['email_address']
                }
            })
            if (!updatedUser) {
                console.error("Failed to update user!")
            }

        }

        return new Response('Webhook received', { status: 200 })
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error verifying webhook', { status: 400 })
    }
}