/*
  MIGRACIÓN AJUSTADA PARA EVITAR ERRORES CON DATOS EXISTENTES
*/

-- 1) Crear tablas nuevas (Employee, Service)
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `durationMinutes` INTEGER NOT NULL,
    `category` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear UN servicio por defecto (para no cortar turnos existentes)
INSERT INTO `Service` (`name`, `price`, `durationMinutes`)
VALUES ('Servicio temporal', 0, 30);

-- 2) Agregar columnas nuevas PERO con valor por defecto
ALTER TABLE `appointment`
    ADD COLUMN `employeeId` INTEGER NULL,
    ADD COLUMN `serviceId` INTEGER NULL; -- inicialmente NULL para evitar error

-- 3) Migrar datos desde la columna vieja "service" (string) a la nueva "serviceId"
-- Todo turno existente apuntará al servicio temporal
UPDATE `appointment`
SET `serviceId` = 1;

-- 4) Eliminar restricciones viejas
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_attendedById_fkey`;
DROP INDEX `Appointment_attendedById_fkey` ON `appointment`;

-- 5) Eliminar columnas viejas AHORA que ya migramos los datos
ALTER TABLE `appointment`
    DROP COLUMN `attendedById`,
    DROP COLUMN `service`;

-- 6) Hacer que serviceId sea obligatorio ahora que todos los registros tienen valor
ALTER TABLE `appointment`
    MODIFY `serviceId` INTEGER NOT NULL;

-- 7) Agregar las nuevas foreign keys
ALTER TABLE `appointment`
    ADD CONSTRAINT `Appointment_serviceId_fkey`
        FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`)
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `appointment`
    ADD CONSTRAINT `Appointment_employeeId_fkey`
        FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`)
        ON DELETE SET NULL ON UPDATE CASCADE;
