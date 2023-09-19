// Created by Tanhapon Tosirikul 2781155t
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import verifyAuthToken from "../middleware/verifyAuthToken";
import { Goal, GoalStore } from "../models/Goal";

dotenv.config();

const goalStore = new GoalStore();

const show = async (req: Request, res: Response) => {
  try {
    const goal = await goalStore.show(parseInt(req.params.id));
    res.json(goal);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const getCurrentUserGoal = async (req: Request, res: Response) => {
  try {
    const goal = await goalStore.getbyuser(parseInt(req.params.id));
    res.json(goal);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const createGoal = async (req: Request, res: Response) => {
  const {
    carbs_percentage_goal,
    fat_percentage_goal,
    protein_percentage_goal,
    carbs_gram_goal,
    fat_gram_goal,
    protein_gram_goal,
    calories_goal,
    expense_limit,
  } = req.body;

  const goal: Goal = {
    carbs_percentage_goal,
    fat_percentage_goal,
    protein_percentage_goal,
    carbs_gram_goal,
    fat_gram_goal,
    protein_gram_goal,
    calories_goal,
    expense_limit,
  };
  try {
    const createdGoal = await goalStore.create(goal, req.body.user_id);
    res.json({
      goal: createdGoal,
    });
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const goal_routes = (app: express.Application): void => {
  app.post("/goals", verifyAuthToken, createGoal);
  app.get("/goals/:id", verifyAuthToken, show);
  app.get("/users/:id/goals", verifyAuthToken, getCurrentUserGoal);
};

export default goal_routes;
