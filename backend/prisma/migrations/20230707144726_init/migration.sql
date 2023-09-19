-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LAUNCH', 'DINNER');

-- CreateTable
CREATE TABLE "DailyWeight" (
    "id" SERIAL NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "DailyWeight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" SERIAL NOT NULL,
    "carbs_percentage_goal" INTEGER NOT NULL,
    "fat_percentage_goal" INTEGER NOT NULL,
    "protein_percentage_goal" INTEGER NOT NULL,
    "carbs_gram_goal" DECIMAL(65,30) NOT NULL,
    "fat_gram_goal" DECIMAL(65,30) NOT NULL,
    "protein_gram_goal" DECIMAL(65,30) NOT NULL,
    "calories_goal" DECIMAL(65,30) NOT NULL,
    "expense_limit" DECIMAL(65,30) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyFoodLog" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "goal_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "DailyFoodLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodEntry" (
    "id" SERIAL NOT NULL,
    "number_of_servings" DECIMAL(65,30) NOT NULL,
    "meal_type" "MealType" NOT NULL,
    "dailyfoodlog_id" INTEGER NOT NULL,
    "foodvariant_id" INTEGER NOT NULL,

    CONSTRAINT "FoodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodVariant" (
    "id" SERIAL NOT NULL,
    "expense" DECIMAL(65,30) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "food_id" INTEGER NOT NULL,

    CONSTRAINT "FoodVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "calories" DECIMAL(65,30) NOT NULL,
    "carbs_gram" DECIMAL(65,30) NOT NULL,
    "fat_gram" DECIMAL(65,30) NOT NULL,
    "protein_gram" DECIMAL(65,30) NOT NULL,
    "serving_size" TEXT NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barcode" (
    "id" SERIAL NOT NULL,
    "barcode" TEXT NOT NULL,
    "food_id" INTEGER NOT NULL,

    CONSTRAINT "Barcode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Barcode_food_id_key" ON "Barcode"("food_id");

-- AddForeignKey
ALTER TABLE "DailyWeight" ADD CONSTRAINT "DailyWeight_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyFoodLog" ADD CONSTRAINT "DailyFoodLog_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyFoodLog" ADD CONSTRAINT "DailyFoodLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodEntry" ADD CONSTRAINT "FoodEntry_dailyfoodlog_id_fkey" FOREIGN KEY ("dailyfoodlog_id") REFERENCES "DailyFoodLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodEntry" ADD CONSTRAINT "FoodEntry_foodvariant_id_fkey" FOREIGN KEY ("foodvariant_id") REFERENCES "FoodVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodVariant" ADD CONSTRAINT "FoodVariant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodVariant" ADD CONSTRAINT "FoodVariant_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barcode" ADD CONSTRAINT "Barcode_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
