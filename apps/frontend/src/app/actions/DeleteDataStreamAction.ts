"use server"

import { db } from "@repo/db";
import { DeleteDataStreamSchema } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";

export async function DeleteDataStreamAction(prevState: unknown, formData: FormData) {
    const user = await currentUser();

    if (!user) redirect("/")
    const parsed = DeleteDataStreamSchema.safeParse({
        dataStreamId: formData.get("dataStreamId")
    })
    if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors, success: false, formErrors: "" }
    const userId = user.id;

    const dataStream = await db.dataStream.findFirst({
        where: {
            id: parsed.data.dataStreamId,
            Device: {
                Project: {
                    userId: user.id
                }
            }

        },
        include: {
            Device: {
                select: {
                    projectId: true
                }
            },
            dataPoints: true

        }
    })
    if (!dataStream) return { errors: {}, success: false, formErrors: "Failed to delete data stream" }
    if (dataStream.dataPoints != null && dataStream.dataPoints.length > 0) return { errors: {}, success: false, formErrors: "You must deleted all data points for this data stream first." }
    const deletedStream = await db.dataStream.delete({
        where: {
            id: parsed.data.dataStreamId
        }
    })
    if (!deletedStream) return { errors: {}, success: false, formErrors: "Failed to delete data stream" }
    after(() => {
        revalidateTag(`data_stream:${userId}:${dataStream.Device.projectId}`);
    });
    return { errors: {}, success: true, formErrors: "" }


}