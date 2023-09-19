-- AlterTable
ALTER TABLE "Food" ALTER COLUMN "brand" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FoodVariant" ALTER COLUMN "brand_snapshot" DROP NOT NULL;
