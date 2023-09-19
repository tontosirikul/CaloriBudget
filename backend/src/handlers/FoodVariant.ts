// Created by Tanhapon Tosirikul 2781155t
import express, { Request, Response } from "express";
import { FoodVariantStore } from "../models/FoodVariant";
import verifyAuthToken from "../middleware/verifyAuthToken";

const foodvariantStore = new FoodVariantStore();

const listFoodVariantsofUser = async (req: Request, res: Response) => {
  try {
    const result = await foodvariantStore.show(Number(req.params.user_id));

    res.json(result);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const updateFoodVariant = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await foodvariantStore.update(
      Number(req.params.foodvariant_id),
      Number(req.body.expense)
    );
    res.json(result);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const deleteFoodVariant = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await foodvariantStore.delete(
      Number(req.params.foodvariant_id)
    );
    res.json(result);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const foodvariant_routes = (app: express.Application): void => {
  app.get("/foodvariant/:user_id", verifyAuthToken, listFoodVariantsofUser);
  app.put("/foodvariant/:foodvariant_id", verifyAuthToken, updateFoodVariant);
  app.delete(
    "/foodvariant/:foodvariant_id",
    verifyAuthToken,
    deleteFoodVariant
  );
};

export default foodvariant_routes;
