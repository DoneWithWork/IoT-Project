import { decryptApiKey } from "@/lib/apikey";
import { db } from "@repo/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await currentUser();
    if (!user) return redirect("/")
    const { id } = await params

    const encryptedKey = await db.apiKey.findFirst({
        where: {
            id,
            userId: user.id
        }
    })
    if (!encryptedKey) return new Response('Failed to find api key', { status: 404 })
    const decryptedKey = await decryptApiKey(encryptedKey.key);
    return Response.json({ "api_key": decryptedKey }, { status: 200 })

}