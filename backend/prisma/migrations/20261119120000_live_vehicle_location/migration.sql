CREATE TABLE "VehicleLocation" (
  "id" TEXT NOT NULL,
  "vehicleId" TEXT NOT NULL,
  "tripId" TEXT,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "accuracyMeters" DOUBLE PRECISION,
  "speedKph" DOUBLE PRECISION,
  "headingDegrees" DOUBLE PRECISION,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VehicleLocation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VehicleLocation_vehicleId_key" ON "VehicleLocation"("vehicleId");
CREATE INDEX "VehicleLocation_tripId_recordedAt_idx" ON "VehicleLocation"("tripId", "recordedAt");

ALTER TABLE "VehicleLocation"
  ADD CONSTRAINT "VehicleLocation_vehicleId_fkey"
  FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VehicleLocation"
  ADD CONSTRAINT "VehicleLocation_tripId_fkey"
  FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;
