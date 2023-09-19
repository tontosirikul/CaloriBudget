// Created by Tanhapon Tosirikul 2781155t
import express, { Request, Response } from "express";
import verifyAuthToken from "../middleware/verifyAuthToken";
import { DashboardQuery } from "../models/Dashboard";

const dashboardQuery = new DashboardQuery();

const getAverageDailyExpense = async (req: Request, res: Response) => {
  try {
    if (Number(req.params.days) <= 0) {
      throw new Error("cannot get data from negative number of days");
    }
    if (Number(req.params.days) != 999) {
      const result = await dashboardQuery.getAverageDailyExpense(
        Number(req.params.days),
        Number(req.params.user_id)
      );
      res.send(result);
    } else {
      const result = await dashboardQuery.getAllAverageDailyExpense(
        Number(req.params.user_id)
      );
      res.send(result);
    }
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const getWeeklySummary = async (req: Request, res: Response) => {
  try {
    const result = await dashboardQuery.getWeeklySummary(
      new Date(req.params.date),
      Number(req.params.user_id)
    );
    res.send(result);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

export const dashboard_routes = (app: express.Application): void => {
  app.get(
    "/dashboard/averagedailyexpense/:days/:user_id",
    verifyAuthToken,
    getAverageDailyExpense
  );
  app.get(
    "/dashboard/weeklysummary/:date/:user_id",
    verifyAuthToken,
    getWeeklySummary
  );
};
