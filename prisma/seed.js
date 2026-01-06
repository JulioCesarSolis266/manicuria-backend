import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const main = async () => {
  const username = "admin"
  const password = "admin123"

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
      username,
      password: hashedPassword,
      role: "admin",
    },
  })

  console.log("✅ Admin creado correctamente:")
  console.log("Usuario:", username)
  console.log("Contraseña:", password)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e)
    process.exit(1)
  })