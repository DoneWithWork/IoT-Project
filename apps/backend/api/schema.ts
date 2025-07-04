import { z } from '@hono/zod-openapi'

export const DataStreamSchema = z.object({
    apiKey: z.string().min(1, {
        message: "Api Key is required!!"
    }).openapi({
        param: {
            name: "apiKey",
        },
        example: "api_key_123456789"
    }),
    deviceAuthToken: z.string().min(1, {
        message: "Device Auth Token is required!!"
    }).openapi({
        param: {
            name: "deviceAuthToken",
        },
        example: "project_device_auth_token_123456"
    }),
    data: z.record(z.union([z.string(), z.number()])).openapi({
        example: {
            temperature: "23.5",
            light: "1000",
            humidity: 26.5,
        }
    })
})
export const DataStreamSchemaResponse = z.object({
    message: z.string().openapi({
        example: "Example message returned from API"
    }),
    success: z.boolean().openapi({
        example: false
    }),
    warning: z.string().optional().openapi({
        example: "Invalid dataStream names detected"
    })
})