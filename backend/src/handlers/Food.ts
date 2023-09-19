// Created by Tanhapon Tosirikul 2781155t
import express, { Request, Response } from "express";
import verifyAuthToken from "../middleware/verifyAuthToken";
import { FoodStore, DraftFood } from "../models/Food";

const foodStore = new FoodStore();

const index = async (req: Request, res: Response) => {
  try {
    const result = await foodStore.index(Number(req.params.user_id));

    res.json(result);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const getFoodFromBarcode = async (req: Request, res: Response) => {
  try {
    const result = await foodStore.showByBarcode(
      req.params.barcode,
      Number(req.params.user_id)
    );
    res.json(result);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const food_routes = (app: express.Application): void => {
  app.get("/users/:user_id/food", verifyAuthToken, index);
  app.get(
    "/users/:user_id/barcode/:barcode",
    verifyAuthToken,
    getFoodFromBarcode
  );
};

export default food_routes;
