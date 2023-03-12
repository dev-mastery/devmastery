import { PrismaClient } from "@prisma/client";

export interface DbError {
  code?: string;
  meta?: any;
  message: string;
}

export type DbClient = PrismaClient;
export const db = new PrismaClient();
