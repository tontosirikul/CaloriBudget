// Created by Tanhapon Tosirikul 2781155t
import prisma from "../prisma";
import { Food, FoodVariant } from "@prisma/client";
import { DraftFoodVariant } from "./FoodVariant";
import { RequireOnly } from "../utils/type";

export type DraftFood = RequireOnly<
  Food,
  | "brand"
  | "description"
  | "calories"
  | "carbs_gram"
  | "fat_gram"
  | "protein_gram"
  | "serving_size"
  | "isGeneric"
  | "barcode"
>;

export class FoodStore {
  async index(user_id: number): Promise<Food[]> {
    try {
      const genericResult = await prisma.food.findMany({
        where: { isGeneric: true },
        include: { foodvariants: { where: { user_id: user_id } } },
      });
      const nonGenericResult = await prisma.food.findMany({
        where: { isGeneric: false },
        include: { foodvariants: { where: { user_id: user_id } } },
      });
      const result = genericResult.concat(nonGenericResult);
      return result;
    } catch (err) {
      throw new Error(`Could not add the new food with new variant. ${err}`);
    }
  }

  async showByBarcode(
    barcode: string,
    user_id: number
  ): Promise<(Food & { foodvariants: FoodVariant[] }) | null> {
    try {
      const result = await prisma.food.findFirst({
        where: {
          barcode: barcode,
        },
        include: { foodvariants: { where: { user_id: user_id } } },
      });
      return result;
    } catch (err) {
      throw new Error(`Could not add the new food with new variant. ${err}`);
    }
  }

  async createWithVariant(
    food: DraftFood,
    foodvariant: DraftFoodVariant
  ): Promise<Food & { foodvariants: FoodVariant[] }> {
    try {
      const result = await prisma.food.create({
        data: {
          ...food,
          foodvariants: { create: { ...foodvariant } },
        },
        include: {
          foodvariants: true,
        },
      });
      return result;
    } catch (err) {
      throw new Error(`Could not add the new food with new variant. ${err}`);
    }
  }
}
