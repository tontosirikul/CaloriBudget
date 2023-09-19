// Created by Tanhapon Tosirikul 2781155t
import prisma from "../prisma";
import { Decimal } from "@prisma/client/runtime/library";

export type Goal = {
  id?: number;
  carbs_percentage_goal: number;
  fat_percentage_goal: number;
  protein_percentage_goal: number;
  carbs_gram_goal: Decimal;
  fat_gram_goal: Decimal;
  protein_gram_goal: Decimal;
  calories_goal: Decimal;
  expense_limit: Decimal;
};

export class GoalStore {
  async show(id: number): Promise<Goal | null> {
    try {
      const result = await prisma.goal.findUnique({
        where: {
          id: Number(id),
        },
      });
      return result;
    } catch (err) {
      throw new Error(`Could not find goal ${id}. Error: ${err}`);
    }
  }
  async create(goal: Goal, user_id: number): Promise<Goal> {
    try {
      const result = await prisma.goal.create({
        data: { ...goal, user_id },
      });
      return result;
    } catch (err) {
      throw new Error(`Could not add new goal ${goal.id}  . ${err}`);
    }
  }

  async getbyuser(user_id: number | undefined): Promise<Goal> {
    try {
      const result = await prisma.goal.findFirst({
        where: {
          user_id: user_id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!result) {
        throw new Error(`No goals found for user ${user_id}`);
      }

      return result;
    } catch (err) {
      throw new Error(`Could not find goal of user ${user_id}. ${err}`);
    }
  }
}
