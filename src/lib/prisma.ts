
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";


const connectionString =
  "postgresql://postgres.uvmdmrgjjealzaidjyjr:224466aa!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
