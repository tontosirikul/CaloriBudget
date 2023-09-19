/*
  Warnings:

  - You are about to drop the `Barcode` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isGeneric` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand_snapshot` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calories_snapshot` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbs_gram_snapshot` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_snapshot` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expense_snapshot` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fat_gram_snapshot` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein_gram_snapshot` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serving_size_snapshot` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand_snapshot` to the `FoodVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calories_snapshot` to the `FoodVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbs_gram_snapshot` to the `FoodVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_snapshot` to the `FoodVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fat_gram_snapshot` to the `FoodVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein_gram_snapshot` to the `FoodVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remark` to the `FoodVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serving_size_snapshot` to the `FoodVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Barcode" DROP CONSTRAINT "Barcode_food_id_fkey";

-- DropForeignKey
ALTER TABLE "FoodEntry" DROP CONSTRAINT "FoodEntry_foodvariant_id_fkey";

-- DropForeignKey
ALTER TABLE "FoodVariant" DROP CONSTRAINT "FoodVariant_food_id_fkey";

-- DropForeignKey
ALTER TABLE "FoodVariant" DROP CONSTRAINT "FoodVariant_user_id_fkey";

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "isGeneric" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "FoodEntry" ADD COLUMN     "brand_snapshot" TEXT NOT NULL,
ADD COLUMN     "calories_snapshot" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "carbs_gram_snapshot" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "description_snapshot" TEXT NOT NULL,
ADD COLUMN     "expense_snapshot" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "fat_gram_snapshot" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "protein_gram_snapshot" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "serving_size_snapshot" TEXT NOT NULL,
ALTER COLUMN "foodvariant_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FoodVariant" ADD COLUMN     "brand_snapshot" TEXT NOT NULL,
ADD COLUMN     "calories_snapshot" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "carbs_gram_snapshot" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "description_snapshot" TEXT NOT NULL,
ADD COLUMN     "fat_gram_snapshot" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "protein_gram_snapshot" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "remark" TEXT NOT NULL,
ADD COLUMN     "serving_size_snapshot" TEXT NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "food_id" DROP NOT NULL;

-- DropTable
DROP TABLE "Barcode";

-- AddForeignKey
ALTER TABLE "FoodVariant" ADD CONSTRAINT "FoodVariant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodVariant" ADD CONSTRAINT "FoodVariant_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodEntry" ADD CONSTRAINT "FoodEntry_foodvariant_id_fkey" FOREIGN KEY ("foodvariant_id") REFERENCES "FoodVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
