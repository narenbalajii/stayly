-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "maxGuests" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Apartment';
