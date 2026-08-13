import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const name = process.env.ADMIN_NAME?.trim() || "Administrador Audify";
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password || password.length < 8 || password === "replace_with_a_secure_password") {
  console.error("Configura ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 8 caracteres) en server/.env");
  process.exitCode = 1;
} else {
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, password: await bcrypt.hash(password, 12), role: "ADMIN" },
    create: { name, email, password: await bcrypt.hash(password, 12), role: "ADMIN" }
  });
  console.log(`Administrador listo: ${user.email}`);
}

await prisma.$disconnect();
