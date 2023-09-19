/*
  Warnings:

  - Changed the type of `date` on the `DailyFoodLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DailyFoodLog" DROP COLUMN "date",
ADD COLUMN     "date" DATE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailyFoodLog_date_user_id_goal_id_key" ON "DailyFoodLog"("date", "user_id", "goal_id");
