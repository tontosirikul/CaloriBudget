/*
  Warnings:

  - Made the column `user_id` on table `FoodVariant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `food_id` on table `FoodVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FoodVariant" DROP CONSTRAINT "FoodVariant_food_id_fkey";

-- DropForeignKey
ALTER TABLE "FoodVariant" DROP CONSTRAINT "FoodVariant_user_id_fkey";

-- AlterTable
ALTER TABLE "FoodVariant" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "food_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "FoodVariant" ADD CONSTRAINT "FoodVariant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodVariant" ADD CONSTRAINT "FoodVariant_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
