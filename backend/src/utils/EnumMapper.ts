// Created by Tanhapon Tosirikul 2781155t
import { MealType } from "@prisma/client";

export function mapStringToMealType(str: string): MealType {
  if (str === "BREAKFAST") {
    return MealType.BREAKFAST;
  } else if (str === "LUNCH") {
    return MealType.LUNCH;
  } else if (str === "DINNER") {
    return MealType.DINNER;
  } else if (str === "SNACK") {
    return MealType.SNACK;
  } else {
    throw new Error("Invalid meal type");
  }
}
