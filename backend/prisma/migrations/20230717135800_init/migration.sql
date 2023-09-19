/*
  Warnings:

  - A unique constraint covering the columns `[date,user_id]` on the table `DailyFoodLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DailyFoodLog_date_user_id_key" ON "DailyFoodLog"("date", "user_id");
