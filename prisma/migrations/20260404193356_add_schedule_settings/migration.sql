-- CreateTable
CREATE TABLE "ScheduleSettings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "maxConcurrentAppointments" INTEGER NOT NULL DEFAULT 1,
    "slotDuration" INTEGER NOT NULL DEFAULT 30,
    "bufferMinutes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduleSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleSettings_userId_key" ON "ScheduleSettings"("userId");

-- AddForeignKey
ALTER TABLE "ScheduleSettings" ADD CONSTRAINT "ScheduleSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
