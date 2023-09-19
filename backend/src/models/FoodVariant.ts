// Created by Tanhapon Tosirikul 2781155t
import prisma from "../prisma";
import { FoodVariant } from "@prisma/client";
import { RequireOnly } from "../utils/type";

export type DraftFoodVariant = RequireOnly<
  FoodVariant,
  | "expense"
  | "brand_snapshot"
  | "description_snapshot"
  | "calories_snapshot"
  | "carbs_gram_snapshot"
  | "fat_gram_snapshot"
  | "protein_gram_snapshot"
  | "serving_size_snapshot"
  | "user_id"
>;

export class FoodVariantStore {
  async show(user_id: number): Promise<FoodVariant[]> {
    try {
      const result = await prisma.foodVariant.findMany({
        where: {
          user_id: user_id,
        },
      });
      return result;
    } catch (err) {
      throw new Error(`Could not get food variant. ${err}`);
    }
  }

  async create(
    food_id: number,
    foodvariant: DraftFoodVariant
  ): Promise<FoodVariant> {
    try {
      const result = prisma.foodVariant.create({
        data: {
          ...foodvariant,
          food_id: food_id,
        },
      });
      return result;
    } catch (err) {
      throw new Error(`Could not add the new variant. ${err}`);
    }
  }

  async update(foodvariant_id: number, expense: number): Promise<FoodVariant> {
    if (expense < 0) throw new Error("expense can not be less than zero.");
    try {
      const result = await prisma.foodVariant.update({
        where: {
          id: foodvariant_id,
        },
        data: {
          expense: expense,
        },
      });
      return result;
    } catch (err) {
      throw new Error(`Could not get food variant. ${err}`);
    }
  }

  async delete(foodvariant_id: number): Promise<FoodVariant> {
    try {
      const result = await prisma.foodVariant.delete({
        where: {
          id: Number(foodvariant_id),
        },
      });
      return result;
    } catch (err) {
      throw new Error(`Could not delete user ${foodvariant_id}. Error: ${err}`);
    }
  }
}
