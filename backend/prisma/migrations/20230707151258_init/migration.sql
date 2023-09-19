/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Barcode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyFoodLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyWeight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Food` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoodEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoodVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Goal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hashed_password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Barcode" DROP CONSTRAINT "Barcode_food_id_fkey";

-- DropForeignKey
ALTER TABLE "DailyFoodLog" DROP CONSTRAINT "DailyFoodLog_goal_id_fkey";

-- DropForeignKey
ALTER TABLE "DailyFoodLog" DROP CONSTRAINT "DailyFoodLog_user_id_fkey";

-- DropForeignKey
ALTER TABLE "DailyWeight" DROP CONSTRAINT "DailyWeight_user_id_fkey";

-- DropForeignKey
ALTER TABLE "FoodEntry" DROP CONSTRAINT "FoodEntry_dailyfoodlog_id_fkey";

-- DropForeignKey
ALTER TABLE "FoodEntry" DROP CONSTRAINT "FoodEntry_foodvariant_id_fkey";

-- DropForeignKey
ALTER TABLE "FoodVariant" DROP CONSTRAINT "FoodVariant_food_id_fkey";

-- DropForeignKey
ALTER TABLE "FoodVariant" DROP CONSTRAINT "FoodVariant_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_user_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "hashed_password" TEXT NOT NULL;

-- DropTable
DROP TABLE "Barcode";

-- DropTable
DROP TABLE "DailyFoodLog";

-- DropTable
DROP TABLE "DailyWeight";

-- DropTable
DROP TABLE "Food";

-- DropTable
DROP TABLE "FoodEntry";

-- DropTable
DROP TABLE "FoodVariant";

-- DropTable
DROP TABLE "Goal";
