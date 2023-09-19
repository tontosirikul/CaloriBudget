// Created by Tanhapon Tosirikul 2781155t
import express, { Request, Response } from "express";
import verifyAuthToken from "../middleware/verifyAuthToken";
import { FoodStore, DraftFood } from "../models/Food";
import {
  DailyFoodLogStore,
  DraftDailyFoodLog,
  DraftEditFoodEntry,
  DraftFoodEntry,
} from "../models/DailyFoodLog";
import { mapStringToMealType } from "../utils/EnumMapper";
import { DraftFoodVariant, FoodVariantStore } from "../models/FoodVariant";

const foodStore = new FoodStore();
const foodvariantStore = new FoodVariantStore();
const dailyfoodlogStore = new DailyFoodLogStore();

const listEntriesofLog = async (req: Request, res: Response) => {
  try {
    const result = await dailyfoodlogStore.listEntriesOfLog(
      new Date(req.query.date as string),
      Number(req.query.user_id)
    );
    res.json(result);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const createFoodAndEntry = async (req: Request, res: Response) => {
  const food: DraftFood = {
    brand: req.body.brand,
    description: req.body.description,
    calories: req.body.calories,
    carbs_gram: req.body.carbs_gram,
    fat_gram: req.body.fat_gram,
    protein_gram: req.body.protein_gram,
    serving_size: req.body.serving_size,
    barcode: req.body.barcode,
    isGeneric: req.body.isGeneric,
  };

  const foodvariant: DraftFoodVariant = {
    expense: req.body.expense,
    user_id: req.body.user_id,
    brand_snapshot: req.body.brand,
    description_snapshot: req.body.description,
    calories_snapshot: req.body.calories,
    carbs_gram_snapshot: req.body.carbs_gram,
    fat_gram_snapshot: req.body.fat_gram,
    protein_gram_snapshot: req.body.protein_gram,
    serving_size_snapshot: req.body.serving_size,
  };

  const dailyfoodlog: DraftDailyFoodLog = {
    date: new Date(req.body.date),
    goal_id: req.body.goal_id,
    user_id: req.body.user_id,
  };

  try {
    const createdFood = await foodStore.createWithVariant(food, foodvariant);
    const foodentry: DraftFoodEntry = {
      number_of_servings: req.body.number_of_servings,
      meal_type: mapStringToMealType(req.body.meal_type),
      foodvariant_id: createdFood.foodvariants[0].id,
      expense_snapshot: req.body.expense,
      brand_snapshot: req.body.brand,
      description_snapshot: req.body.description,
      calories_snapshot: req.body.calories,
      carbs_gram_snapshot: req.body.carbs_gram,
      fat_gram_snapshot: req.body.fat_gram,
      protein_gram_snapshot: req.body.protein_gram,
      serving_size_snapshot: req.body.serving_size,
    };
    const log = await dailyfoodlogStore.findOrCreateWithEntry(
      dailyfoodlog,
      foodentry
    );

    res.status(200).send({ dailyfoodlog: log });
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const createFoodEntryByMyFood = async (req: Request, res: Response) => {
  const dailyfoodlog: DraftDailyFoodLog = {
    date: new Date(req.body.date),
    goal_id: req.body.goal_id,
    user_id: req.body.user_id,
  };
  try {
    const foodvariant = await foodvariantStore.update(
      Number(req.body.foodvariant_id),
      Number(req.body.expense)
    );
    const foodentry: DraftFoodEntry = {
      number_of_servings: req.body.number_of_servings,
      meal_type: mapStringToMealType(req.body.meal_type),
      foodvariant_id: foodvariant.id,
      expense_snapshot: req.body.expense,
      brand_snapshot: req.body.brand,
      description_snapshot: req.body.description,
      calories_snapshot: req.body.calories,
      carbs_gram_snapshot: req.body.carbs_gram,
      fat_gram_snapshot: req.body.fat_gram,
      protein_gram_snapshot: req.body.protein_gram,
      serving_size_snapshot: req.body.serving_size,
    };
    const log = await dailyfoodlogStore.findOrCreateWithEntry(
      dailyfoodlog,
      foodentry
    );
    res.status(200).send({ dailyfoodlog: log });
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const createFoodEntryByProvidedFood = async (req: Request, res: Response) => {
  const foodvariant: DraftFoodVariant = {
    expense: req.body.expense,
    user_id: req.body.user_id,
    brand_snapshot: req.body.brand,
    description_snapshot: req.body.description,
    calories_snapshot: req.body.calories,
    carbs_gram_snapshot: req.body.carbs_gram,
    fat_gram_snapshot: req.body.fat_gram,
    protein_gram_snapshot: req.body.protein_gram,
    serving_size_snapshot: req.body.serving_size,
  };

  const dailyfoodlog: DraftDailyFoodLog = {
    date: new Date(req.body.date),
    goal_id: req.body.goal_id,
    user_id: req.body.user_id,
  };

  try {
    const createdFoodVariant = await foodvariantStore.create(
      Number(req.body.food_id),
      foodvariant
    );
    const foodentry: DraftFoodEntry = {
      number_of_servings: req.body.number_of_servings,
      meal_type: mapStringToMealType(req.body.meal_type),
      foodvariant_id: createdFoodVariant.id,
      expense_snapshot: req.body.expense,
      brand_snapshot: req.body.brand,
      description_snapshot: req.body.description,
      calories_snapshot: req.body.calories,
      carbs_gram_snapshot: req.body.carbs_gram,
      fat_gram_snapshot: req.body.fat_gram,
      protein_gram_snapshot: req.body.protein_gram,
      serving_size_snapshot: req.body.serving_size,
    };
    const log = await dailyfoodlogStore.findOrCreateWithEntry(
      dailyfoodlog,
      foodentry
    );
    res.status(200).send({ dailyfoodlog: log });
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const updateFoodentry = async (req: Request, res: Response) => {
  try {
    const draftEditFoodEntry: DraftEditFoodEntry = {
      number_of_servings: req.body.number_of_servings,
      meal_type: mapStringToMealType(req.body.meal_type),
      expense_snapshot: req.body.expense_snapshot,
    };
    const result = await dailyfoodlogStore.updateFoodEntry(
      Number(req.params.entry_id),
      draftEditFoodEntry
    );
    res.json(result);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const deleteFoodentry = async (req: Request, res: Response) => {
  try {
    const result = await dailyfoodlogStore.deleteFoodEntry(
      Number(req.params.entry_id)
    );
    res.json(result);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const dailylog_routes = (app: express.Application): void => {
  app.get("/dailylog", verifyAuthToken, listEntriesofLog);
  app.post("/dailylog/createfood", verifyAuthToken, createFoodAndEntry);
  app.post(
    "/dailylog/createentry/myfood",
    verifyAuthToken,
    createFoodEntryByMyFood
  );
  app.post(
    "/dailylog/createentry/providedfood",
    verifyAuthToken,
    createFoodEntryByProvidedFood
  );
  app.put("/editfoodentry/:entry_id", verifyAuthToken, updateFoodentry);
  app.delete("/deletefoodentry/:entry_id", verifyAuthToken, deleteFoodentry);
};

export default dailylog_routes;
