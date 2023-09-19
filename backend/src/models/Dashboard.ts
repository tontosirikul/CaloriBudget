// Created by Tanhapon Tosirikul 2781155t
import { Goal } from "@prisma/client";
import prisma from "../prisma";
import { Decimal } from "@prisma/client/runtime/library";

type ExpenseGroup = {
  date: string;
  totalExpense: number;
};

type WeekSummary = {
  date: string;
  totalExpense: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  goal: Pick<
    Goal,
    | "carbs_gram_goal"
    | "fat_gram_goal"
    | "protein_gram_goal"
    | "calories_goal"
    | "expense_limit"
  >;
};

export class DashboardQuery {
  async getAverageDailyExpense(
    days: number,
    user_id: number
  ): Promise<ExpenseGroup[]> {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    let endDate = new Date();
    try {
      const foodEntries = await prisma.foodEntry.findMany({
        where: {
          dailyfoodlog: {
            date: {
              gte: startDate,
              lte: endDate,
            },
            user_id: user_id,
          },
        },
        include: {
          dailyfoodlog: true,
        },
        orderBy: {
          dailyfoodlog: {
            date: "asc",
          },
        },
      });

      let dailyExpense: ExpenseGroup[] = [];

      for (let day = 0; day < days; day++) {
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + day);
        let date = currentDate.toISOString().split("T")[0];
        dailyExpense.push({
          date,
          totalExpense: 0,
        });
      }

      foodEntries.forEach((entry) => {
        const totalExpense =
          Number(entry.number_of_servings) * Number(entry.expense_snapshot);
        const date = entry.dailyfoodlog.date.toISOString().split("T")[0];

        let expenseItem = dailyExpense.find((item) => item.date === date);
        if (expenseItem) {
          expenseItem.totalExpense += totalExpense;
        }
      });

      return dailyExpense;
    } catch (err) {
      throw new Error(`Error get average expense summary: ${err}`);
    }
  }

  async getAllAverageDailyExpense(user_id: number): Promise<ExpenseGroup[]> {
    try {
      const dailyfoodlogs = await prisma.dailyFoodLog.findMany({
        where: {
          user_id: user_id,
        },
        include: {
          foodentries: true,
        },
        orderBy: {
          date: "asc",
        },
      });

      let dailyExpense: ExpenseGroup[] = [];
      for (
        let d = new Date(dailyfoodlogs[0].date);
        d <= new Date(dailyfoodlogs[dailyfoodlogs.length - 1].date);
        d.setDate(d.getDate() + 1)
      ) {
        dailyExpense.push({
          date: new Date(d).toISOString().split("T")[0],
          totalExpense: 0,
        });
      }

      dailyfoodlogs.forEach((log) => {
        const date = log.date.toISOString().split("T")[0];
        let expenseItem = dailyExpense.find((item) => item.date === date);

        if (expenseItem) {
          log.foodentries.forEach((entry) => {
            const totalExpense =
              Number(entry.number_of_servings) * Number(entry.expense_snapshot);
            if (expenseItem) expenseItem.totalExpense += totalExpense;
          });
        }
      });

      return dailyExpense;
    } catch (err) {
      throw new Error(`Error get average expense summary: ${err}`);
    }
  }

  async getWeeklySummary(date: Date, user_id: number): Promise<WeekSummary[]> {
    let currentDate = new Date();
    let lastSunday = new Date();
    lastSunday.setDate(currentDate.getDate() - currentDate.getDay());
    let nextSaturday = new Date();
    nextSaturday.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
    try {
      const foodEntries = await prisma.foodEntry.findMany({
        where: {
          dailyfoodlog: {
            date: {
              gte: lastSunday,
              lte: nextSaturday,
            },
            user_id: user_id,
          },
        },
        include: {
          dailyfoodlog: {
            include: {
              goal: true,
            },
          },
        },
        orderBy: {
          dailyfoodlog: {
            date: "asc",
          },
        },
      });
      let currentGoal = await prisma.goal.findFirst({
        where: { user_id: user_id },
        orderBy: {
          createdAt: "desc",
        },
      });
      let defaultGoal = {
        carbs_gram_goal: new Decimal(250),
        fat_gram_goal: new Decimal(44),
        protein_gram_goal: new Decimal(150),
        calories_goal: new Decimal(2000),
        expense_limit: new Decimal(20),
      };
      let weeklySummary: WeekSummary[] = [];
      for (let day = 0; day < 7; day++) {
        let currentDate = new Date(lastSunday);
        currentDate.setDate(currentDate.getDate() + day);
        let date = currentDate.toISOString().split("T")[0];
        let foodEntryOfTheDay = foodEntries.find(
          (entry) =>
            entry.dailyfoodlog.date.toISOString().split("T")[0] === date
        );
        let goalOfTheDay = foodEntryOfTheDay
          ? foodEntryOfTheDay.dailyfoodlog.goal
          : null;
        weeklySummary.push({
          date,
          totalExpense: 0,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          goal: goalOfTheDay
            ? goalOfTheDay
            : currentGoal
            ? currentGoal
            : defaultGoal,
        });
      }
      foodEntries.forEach((entry) => {
        const totalExpense =
          Number(entry.number_of_servings) * Number(entry.expense_snapshot);
        const totalCalories =
          Number(entry.number_of_servings) * Number(entry.calories_snapshot);
        const totalProtein =
          Number(entry.number_of_servings) *
          Number(entry.protein_gram_snapshot);
        const totalCarbs =
          Number(entry.number_of_servings) * Number(entry.carbs_gram_snapshot);
        const totalFat =
          Number(entry.number_of_servings) * Number(entry.fat_gram_snapshot);
        const date = entry.dailyfoodlog.date.toISOString().split("T")[0];

        let summaryItem = weeklySummary.find((item) => item.date === date);
        if (summaryItem) {
          summaryItem.totalExpense += totalExpense;
          summaryItem.totalCalories += totalCalories;
          summaryItem.totalProtein += totalProtein;
          summaryItem.totalCarbs += totalCarbs;
          summaryItem.totalFat += totalFat;
        }
      });
      return weeklySummary;
    } catch (err) {
      throw new Error(`Error get weekly summary: ${err}`);
    }
  }
}
