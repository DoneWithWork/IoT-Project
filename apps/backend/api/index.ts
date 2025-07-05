import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { Context } from 'hono'
import { every } from 'hono/combine'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { timeout } from 'hono/timeout'
import { handle } from 'hono/vercel'
import { DataStreamRoute } from './route.js'

import { db } from "@repo/db";
const app = new OpenAPIHono({ strict: true }).basePath('/api')

const customTimeoutException = (context: Context): HTTPException =>
  new HTTPException(408, {
    message: `Request timeout after waiting ${context.req.header(
      'Duration'
    )} seconds. Please try again later.`,
  })
app.use(
  every(cors({
    origin: ["http://localhost:3000", "https://iot-project-frontend.vercel.app"],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE'],
  }),
    csrf({
      origin: ["http://localhost:3000", "https://iot-project-frontend.vercel.app"],
    })
  ),
  secureHeaders(),
  logger(),
  timeout(10000, customTimeoutException),

)

// The OpenAPI documentation will be available at / doc
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})
app.get('/ui', swaggerUI({ url: '/api/doc' }))

app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' })
})

app.openapi(DataStreamRoute, async (c) => {
  const { apiKey, data, deviceAuthToken } = c.req.valid('param')

  // check if api key is correct type and exists
  const ApiKeyModel = await db.apiKey.findFirst({
    where: {
      key: apiKey
    }
  })
  if (!ApiKeyModel) return c.json({ message: "No Api Key Model exists", success: false }, 404)
  if (ApiKeyModel.type !== "READ_WRITE") return c.json({ message: "Api Key used meant for READ only. Please use a different one.", success: false }, 403)

  const Device = await db.device.findFirst({
    where: {
      deviceAuthToken
    },
    include: {
      dataStreams: true
    }
  })
  if (!Device) return c.json({ message: "Failed to find device for this deviceAuthToken", success: false }, 404)

  const dataStreams = Device.dataStreams as { title: string; id: string }[]

  const streamMap = new Map(dataStreams.map(ds => [ds.title, ds.id]))

  let unknownKeys: string[] = []
  let values = []

  Object.entries(data).forEach(([key, value]) => {
    const dataStreamId = streamMap.get(key)
    if (!dataStreamId) {
      console.warn(`Unknown stream "${key}"`)
      unknownKeys.push(`Unknown key: "${key}"`)
      return
    }

    values.push({ value: `${value}`, dataStreamId, type: "string" })
  })

  if (unknownKeys.length > 0) {
    return c.json({
      success: true,
      message: "Some data points were created, but some keys were unrecognized.",
      warning: "The following keys were ignored:", unknownKeys,
    }, 200)
  }
  return c.json({ success: true, message: "Successfully created all data points" })
})

app.notFound((c) => {
  return c.text("Route not found", 404)
})
app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})
export const runtime = 'nodejs'

export const GET = handle(app)
export const POST = handle(app)