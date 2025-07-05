import { PrismaClient } from "../generated/prisma/index.js";
var globalForPrisma = globalThis;
export var db = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = db;
