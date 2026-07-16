// src/lib/prisma.ts
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Khởi tạo connection pool từ DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Tạo adapter cho Prisma v7
const adapter = new PrismaPg(pool);

// Prisma Client singleton với adapter cho Prisma v7
declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };