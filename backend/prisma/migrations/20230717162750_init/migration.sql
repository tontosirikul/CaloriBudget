/*
  Warnings:

  - The values [LAUNCH] on the enum `MealType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MealType_new" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');
ALTER TABLE "FoodEntry" ALTER COLUMN "meal_type" TYPE "MealType_new" USING ("meal_type"::text::"MealType_new");
ALTER TYPE "MealType" RENAME TO "MealType_old";
ALTER TYPE "MealType_new" RENAME TO "MealType";
DROP TYPE "MealType_old";
COMMIT;
