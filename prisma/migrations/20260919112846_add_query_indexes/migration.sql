-- CreateIndex
CREATE INDEX "Appointment_providerId_status_startsAt_idx" ON "Appointment"("providerId", "status", "startsAt");

-- CreateIndex
CREATE INDEX "Appointment_providerId_startsAt_endsAt_idx" ON "Appointment"("providerId", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Appointment_status_reminder24hSent_startsAt_idx" ON "Appointment"("status", "reminder24hSent", "startsAt");

-- CreateIndex
CREATE INDEX "Appointment_status_reminder1hSent_startsAt_idx" ON "Appointment"("status", "reminder1hSent", "startsAt");

-- CreateIndex
CREATE INDEX "Availability_providerId_dayOfWeek_idx" ON "Availability"("providerId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "Client_providerId_idx" ON "Client"("providerId");

-- CreateIndex
CREATE INDEX "TimeOff_providerId_startsAt_endsAt_idx" ON "TimeOff"("providerId", "startsAt", "endsAt");
