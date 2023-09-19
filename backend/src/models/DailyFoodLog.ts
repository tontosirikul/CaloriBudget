// Created by Tanhapon Tosirikul 2781155t
import Decimal from "decimal.js";
import prisma from "../prisma";
import { DailyFoodLog, FoodEntry, MealType } from "@prisma/client";
import { RequireOnly } from "../utils/type";

export type DraftDailyFoodLog = Omit<DailyFoodLog, "id">;

export type DraftFoodEntry = RequireOnly<
  FoodEntry,
  | "number_of_servings"
  | "meal_type"
  | "foodvariant_id"
  | "brand_snapshot"
  | "description_snapshot"
  | "calories_snapshot"
  | "carbs_gram_snapshot"
  | "fat_gram_snapshot"
  | "protein_gram_snapshot"
  | "serving_size_snapshot"
  | "expense_snapshot"
>;

export type DraftEditFoodEntry = Pick<
  FoodEntry,
  "number_of_servings" | "meal_type" | "expense_snapshot"
>;

export type FoodEntryWithoutId = {
  id?: number;
  number_of_servings: Decimal;
  meal_type: MealType;
  foodvariant_id: number;
};

type FoodEntryGroupByMealType = {
  mealtype: string;
  data: FoodEntry[];
};

export class DailyFoodLogStore {
  async findOrCreateWithEntry(
    dailyfoodlog: DraftDailyFoodLog,
    foodentry: DraftFoodEntry
  ): Promise<DailyFoodLog & { foodentries: FoodEntry[] }> {
    try {
      let existingLog = await prisma.dailyFoodLog.findUnique({
        where: {
          UserDailyFoodLog: {
            date: dailyfoodlog.date,
            user_id: dailyfoodlog.user_id,
          },
        },
      });

      if (!existingLog) {
        const newLog = await prisma.dailyFoodLog.create({
          data: { ...dailyfoodlog, foodentries: { create: { ...foodentry } } },
          include: {
            foodentries: true,
          },
        });
        return newLog;
      }
      const updatedLog = await prisma.dailyFoodLog.update({
        where: {
          UserDailyFoodLog: {
            date: dailyfoodlog.date,
            user_id: dailyfoodlog.user_id,
          },
        },
        data: {
          foodentries: {
            create: { ...foodentry },
          },
        },
        include: {
          foodentries: true,
        },
      });
      return updatedLog;
    } catch (err) {
      throw new Error(`Could not add the new daily food log. ${err}`);
    }
  }

  async updateFoodEntry(
    entry_id: number,
    foodentry: DraftEditFoodEntry
  ): Promise<FoodEntry> {
    try {
      const result = prisma.foodEntry.update({
        where: {
          id: entry_id,
        },
        data: {
          number_of_servings: foodentry.number_of_servings,
          meal_type: foodentry.meal_type,
          expense_snapshot: foodentry.expense_snapshot,
        },
      });
      return result;
    } catch (err) {
      throw new Error(`Error updating food entry: ${err}`);
    }
  }

  async deleteFoodEntry(entry_id: number): Promise<FoodEntry> {
    try {
      const result = await prisma.foodEntry.delete({
        where: {
          id: entry_id,
        },
      });

      const remainingEntries = await prisma.foodEntry.count({
        where: {
          dailyfoodlog_id: result.dailyfoodlog_id,
        },
      });

      if (remainingEntries === 0) {
        await prisma.dailyFoodLog.delete({
          where: {
            id: result.dailyfoodlog_id,
          },
        });
      }
      return result;
    } catch (err) {
      throw new Error(`Error deleting food entry: ${err}`);
    }
  }

  async listEntriesOfLog(
    date: Date,
    userId: number
  ): Promise<DailyFoodLog & { foodentries: FoodEntryGroupByMealType[] }> {
    try {
      const result = await prisma.dailyFoodLog.findUnique({
        where: {
          UserDailyFoodLog: {
            date: date,
            user_id: userId,
          },
        },
        include: {
          goal: true,
        },
      });
      if (!result) throw new Error("No DailyFoodLog Found");
      const entries = await prisma.foodEntry.findMany({
        orderBy: { meal_type: "asc" },
        where: {
          dailyfoodlog_id: result.id,
        },
      });
      const groupedEntries = entries.reduce(
        (accumulator: FoodEntryGroupByMealType[], currentItem: FoodEntry) => {
          const key = currentItem.meal_type;
          const mealTypeObject = accumulator.find(
            (group) => group["mealtype"] === key
          );
          if (mealTypeObject) {
            mealTypeObject.data.push(currentItem);
          } else {
            accumulator.push({
              mealtype: key,
              data: [currentItem],
            });
          }
          return accumulator;
        },
        []
      );

      return { ...result, foodentries: groupedEntries };
    } catch (err) {
      throw new Error(`Could not get the daily food log. ${err}`);
    }
  }
}
