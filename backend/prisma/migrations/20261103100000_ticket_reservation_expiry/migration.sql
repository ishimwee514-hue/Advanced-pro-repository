ALTER TABLE "Ticket" ADD COLUMN "expiresAt" TIMESTAMP(3);

-- Give existing pending reservations the same 15-minute lifetime as new reservations.
UPDATE "Ticket"
SET "expiresAt" = "createdAt" + INTERVAL '15 minutes'
WHERE "status" = 'PENDING';

-- Release reservations that had already exceeded their original lifetime.
UPDATE "Ticket"
SET "status" = 'CANCELLED'
WHERE "status" = 'PENDING'
  AND "expiresAt" <= CURRENT_TIMESTAMP;

-- Only pending and confirmed tickets occupy a seat. Cancelled/refunded tickets
-- remain in passenger history without permanently blocking the seat.
DROP INDEX "Ticket_tripId_seatNumber_key";
CREATE UNIQUE INDEX "Ticket_tripId_seatNumber_active_key"
  ON "Ticket"("tripId", "seatNumber")
  WHERE "status" IN ('PENDING', 'CONFIRMED');

CREATE INDEX "Ticket_status_expiresAt_idx"
  ON "Ticket"("status", "expiresAt");
