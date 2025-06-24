import { z } from "zod";

export const formSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().min(2).max(300),
})
export const ApiKeySchema = z.object({
    name: z.string().min(2).max(100, {
        message: "Name must contain between 2 to 100 characters"
    }),
    type: z.enum(['READ', 'READ_WRITE'])
})
export const DataStreamSchema = z.object({
    title: z.string().min(2).max(100, {
        message: "Name must contain between 2 to 100 characters"
    }),
    description: z.string().min(2).max(300),
    deviceId: z.string().min(1, "Device Id is required!"),
    projectId: z.string().min(1, "Project id is required")

})
export const DeviceSchema = z.object({
    name: z.string().min(2).max(100, {
        message: "Name must contain between 2 to 100 characters"
    }),
    description: z.string().min(2).max(300),
    deviceType: z.enum(['ESP32', 'ESP8266', 'NODEMCU', 'HIBISCUS_SENSE']),
    projectId: z.string().min(1, "Project is required")

})