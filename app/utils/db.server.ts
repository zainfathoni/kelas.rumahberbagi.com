import { PrismaClient } from '@prisma/client'
import { generateId } from './nanoid'

let db: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient()

  // Middleware to auto-generate NanoID for models missing an id on create.
  // This serves as a safety net in case `id: generateId()` is forgotten.
  client.$use(async (params, next) => {
    if (params.action === 'create' && params.args?.data) {
      if (!params.args.data.id) {
        params.args.data.id = generateId()
      }
    }
    return next(params)
  })

  return client
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === 'production') {
  db = createPrismaClient()
  db.$connect()
} else {
  if (!global.__db) {
    global.__db = createPrismaClient()
    global.__db.$connect()
  }
  db = global.__db
}

export { db }
