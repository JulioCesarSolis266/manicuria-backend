import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const main = async () => {
  console.log("🚀 Seed ejecutándose...")

  const username = "admin"
  const password = "0800j" // SOLO desarrollo
  const phone = "0000000000"

  const existingUser = await prisma.user.findUnique({
    where: { username },
  })

  if (existingUser) {
    console.log("⚠️ Ya existe un usuario admin, no se creó uno nuevo.")
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name: "Admin",
      surname: "Sistema",
      username,
      password: hashedPassword,
      phone,
      role: "admin",
      isActive: true,
      forcePasswordReset: true,
    },
  })

  console.log("✅ Admin creado correctamente")
  console.log("Usuario:", username)
  console.log("Contraseña:", password)
  console.log("⚠️ Cambiar la contraseña al primer login")
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
