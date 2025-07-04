import { createRoute, z } from '@hono/zod-openapi'
import { DataStreamSchema, DataStreamSchemaResponse } from './schema'

export const DataStreamRoute = createRoute({
    method: 'post',
    path: '/add-data-datastream',
    request: {
        params: DataStreamSchema,
    },
    responses: {
        200: {
            description: 'Success',
            content: {
                "application/json": {
                    schema: DataStreamSchemaResponse,
                },
            },
        },
        403: {
            description: 'Forbidden - wrong API key type',
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        success: z.boolean(),
                    }),
                },
            },
        },
        404: {
            description: 'Not Found - API key or device not found',
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        success: z.boolean(),
                    }),
                },
            },
        }
    }
})