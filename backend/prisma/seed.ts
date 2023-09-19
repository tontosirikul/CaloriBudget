// From https://www.prisma.io/docs/getting-started edited by Tanhapon Tosirikul 2781155t
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { FoodStore } from "../src/models/Food";
import { Decimal } from "@prisma/client/runtime";
import { DailyFoodLogStore } from "../src/models/DailyFoodLog";
import { mapStringToMealType } from "../src/utils/EnumMapper";

dotenv.config();

const prisma = new PrismaClient();

const saltRounds: string = bcrypt.genSaltSync(
  parseInt(process.env.saltRounds as string)
);

const bcrypt_code: string = process.env.bcrypt_code as string;

async function testSeeding() {
  const foodStore = new FoodStore();
  const dailyfoodlogStore = new DailyFoodLogStore();

  // mock user for general testing
  await prisma.user.create({
    data: {
      email: "test@test.com",
      username: "test",
      hashed_password: bcrypt.hashSync(
        "1234567890" + bcrypt_code,
        parseInt(saltRounds)
      ),
      goals: {
        create: {
          carbs_percentage_goal: 50,
          fat_percentage_goal: 20,
          protein_percentage_goal: 30,
          carbs_gram_goal: 250,
          fat_gram_goal: 44,
          protein_gram_goal: 150,
          calories_goal: 2000,
          expense_limit: 20,
        },
      },
    },
  });

  // mock user for testing dailyfoodlog, food and food variant
  await prisma.user.create({
    data: {
      email: "testdailyfoodlog@test.com",
      username: "testdailyfoodlog",
      hashed_password: bcrypt.hashSync(
        "1234567890" + bcrypt_code,
        parseInt(saltRounds)
      ),
      goals: {
        create: {
          carbs_percentage_goal: 50,
          fat_percentage_goal: 20,
          protein_percentage_goal: 30,
          carbs_gram_goal: 250,
          fat_gram_goal: 44,
          protein_gram_goal: 150,
          calories_goal: 2000,
          expense_limit: 20,
        },
      },
    },
  });

  // mock user for testing food
  await prisma.user.create({
    data: {
      email: "testfood@test.com",
      username: "testfood",
      hashed_password: bcrypt.hashSync(
        "1234567890" + bcrypt_code,
        parseInt(saltRounds)
      ),
      goals: {
        create: {
          carbs_percentage_goal: 50,
          fat_percentage_goal: 20,
          protein_percentage_goal: 30,
          carbs_gram_goal: 250,
          fat_gram_goal: 44,
          protein_gram_goal: 150,
          calories_goal: 2000,
          expense_limit: 20,
        },
      },
    },
  });

  // mock user for testing food variant
  await prisma.user.create({
    data: {
      email: "testfoodvariant@test.com",
      username: "testfoodvariant",
      hashed_password: bcrypt.hashSync(
        "1234567890" + bcrypt_code,
        parseInt(saltRounds)
      ),
      goals: {
        create: {
          carbs_percentage_goal: 50,
          fat_percentage_goal: 20,
          protein_percentage_goal: 30,
          carbs_gram_goal: 250,
          fat_gram_goal: 44,
          protein_gram_goal: 150,
          calories_goal: 2000,
          expense_limit: 20,
        },
      },
    },
  });

  // mock user for testing goal
  await prisma.user.create({
    data: {
      email: "testgoal@test.com",
      username: "testgoal",
      hashed_password: bcrypt.hashSync(
        "1234567890" + bcrypt_code,
        parseInt(saltRounds)
      ),
      goals: {
        create: {
          carbs_percentage_goal: 50,
          fat_percentage_goal: 20,
          protein_percentage_goal: 30,
          carbs_gram_goal: 250,
          fat_gram_goal: 44,
          protein_gram_goal: 150,
          calories_goal: 2000,
          expense_limit: 20,
        },
      },
    },
    include: { goals: true },
  });

  // mock user for testing dashboard
  const { id, goals } = await prisma.user.create({
    data: {
      email: "testdashboard@test.com",
      username: "testdashboard",
      hashed_password: bcrypt.hashSync(
        "1234567890" + bcrypt_code,
        parseInt(saltRounds)
      ),
      goals: {
        create: {
          carbs_percentage_goal: 50,
          fat_percentage_goal: 20,
          protein_percentage_goal: 30,
          carbs_gram_goal: 250,
          fat_gram_goal: 44,
          protein_gram_goal: 150,
          calories_goal: 2000,
          expense_limit: 20,
        },
      },
    },
    include: { goals: true },
  });

  // create generic food without variant
  await prisma.food.create({
    data: {
      brand: "Hi Di Lao",
      description: "Hotpot Seasoning",
      calories: 673,
      carbs_gram: 5.8,
      protein_gram: 7.9,
      fat_gram: 68,
      serving_size: "100 g/ml",
      isGeneric: true,
      barcode: "5060786250452",
    },
  });

  // create generic food without variant
  await prisma.food.create({
    data: {
      brand: "The Coca-Cola Company",
      description: "Diet coke",
      calories: 0.4,
      carbs_gram: 0,
      protein_gram: 0,
      fat_gram: 0,
      serving_size: "100 g/ml",
      isGeneric: true,
      barcode: "54491496",
    },
  });

  // create user provided food without variant
  await prisma.food.create({
    data: {
      brand: "Backyard",
      description: "cashew nuts",
      calories: 553,
      carbs_gram: 30,
      protein_gram: 18,
      fat_gram: 44,
      serving_size: "100 g/ml",
      isGeneric: false,
      barcode: "",
    },
  });

  // create user provided food with variant
  const { foodvariants } = await foodStore.createWithVariant(
    {
      brand: "Backyard",
      description: "Banana",
      calories: new Decimal(89),
      carbs_gram: new Decimal(23),
      protein_gram: new Decimal(1.1),
      fat_gram: new Decimal(0.3),
      serving_size: "100 g/ml",
      isGeneric: false,
      barcode: "",
    },
    {
      user_id: id,
      expense: new Decimal(0.5),
      brand_snapshot: "Backyard",
      description_snapshot: "Banana",
      calories_snapshot: new Decimal(89),
      carbs_gram_snapshot: new Decimal(23),
      protein_gram_snapshot: new Decimal(1.1),
      fat_gram_snapshot: new Decimal(0.3),
      serving_size_snapshot: "100 g/ml",
    }
  );

  // create user provided food with variant
  await foodStore.createWithVariant(
    {
      brand: "Forest",
      description: "Apple",
      calories: new Decimal(52),
      carbs_gram: new Decimal(14),
      protein_gram: new Decimal(0.3),
      fat_gram: new Decimal(0.2),
      serving_size: "100 g/ml",
      isGeneric: false,
      barcode: "",
    },
    {
      user_id: id,
      expense: new Decimal(0.5),
      brand_snapshot: "Forest",
      description_snapshot: "Apple",
      calories_snapshot: new Decimal(52),
      carbs_gram_snapshot: new Decimal(14),
      protein_gram_snapshot: new Decimal(0.3),
      fat_gram_snapshot: new Decimal(0.2),
      serving_size_snapshot: "100 g/ml",
    }
  );

  // create sample daily food log
  const days = 14;
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  for (let day = 0; day < days; day++) {
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);
    let date = currentDate.toISOString().split("T")[0];
    await dailyfoodlogStore.findOrCreateWithEntry(
      {
        date: new Date(date),
        goal_id: goals[0].id,
        user_id: id,
      },
      {
        number_of_servings: new Decimal((day + 1) / 2),
        meal_type: mapStringToMealType("BREAKFAST"),
        foodvariant_id: foodvariants[0].id,
        expense_snapshot: foodvariants[0].expense,
        brand_snapshot: foodvariants[0].brand_snapshot,
        description_snapshot: foodvariants[0].description_snapshot,
        calories_snapshot: foodvariants[0].calories_snapshot,
        carbs_gram_snapshot: foodvariants[0].carbs_gram_snapshot,
        fat_gram_snapshot: foodvariants[0].fat_gram_snapshot,
        protein_gram_snapshot: foodvariants[0].protein_gram_snapshot,
        serving_size_snapshot: foodvariants[0].serving_size_snapshot,
      }
    );
  }
}

async function devSeeding() {}

async function main() {
  if (process.env.NODE_ENV === "development") {
    await devSeeding();
  } else {
    await testSeeding();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
