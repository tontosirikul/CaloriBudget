// Created by Tanhapon Tosirikul 2781155t
import express, { Request, Response } from "express";
import { User, UserStore } from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verifyAuthToken from "../middleware/verifyAuthToken";
import { Goal, GoalStore } from "../models/Goal";

dotenv.config();

const userStore = new UserStore();
const goalStore = new GoalStore();

const index = async (req: Request, res: Response) => {
  try {
    const users = await userStore.index();
    res.json(users);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await userStore.show(parseInt(req.params.id));
    res.json(user);
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    const user: User = {
      email,
      username,
      hashed_password: password,
    };

    const newUser = await userStore.create(user);

    const userwithtoken = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as jwt.Secret
    );

    const goal: Goal = {
      carbs_percentage_goal: req.body.carbs_percentage_goal,
      fat_percentage_goal: req.body.fat_percentage_goal,
      protein_percentage_goal: req.body.protein_percentage_goal,
      carbs_gram_goal: req.body.carbs_gram_goal,
      fat_gram_goal: req.body.fat_gram_goal,
      protein_gram_goal: req.body.protein_gram_goal,
      calories_goal: req.body.calories_goal,
      expense_limit: req.body.expense_limit,
    };

    if (newUser.id) {
      const newGoal = await goalStore.create(goal, newUser.id);
      res.json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        userwithtoken: userwithtoken,
        goal: newGoal,
      });
    }
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const update = async (req: express.Request, res: express.Response) => {
  try {
    const user = {
      email: req.body.email ? req.body.email : null,
      username: req.body.username ? req.body.username : null,
    };

    const updatedUser = await userStore.update(parseInt(req.params.id), user);
    const userwithtoken = jwt.sign(
      { user: updatedUser },
      process.env.TOKEN_SECRET as jwt.Secret
    );
    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      userwithtoken,
    });
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};
// unused handler
// const destroy = async (req: Request, res: Response) => {
//   console.log(req.params.id);
//   try {
//     const deletedUser = await userStore.delete(parseInt(req.params.id));
//     res.json(deletedUser);
//   } catch (error: unknown) {
//     const { message } = error as Error;
//     console.log(message);
//     res.status(400).send({ message });
//   }
// };

const changepassword = async (req: Request, res: Response) => {
  try {
    const updatedUser = await userStore.changepassword(
      parseInt(req.params.id),
      req.body.oldpassword,
      req.body.newpassword
    );
    res.json({ updatedUser });
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(400).send({ message });
  }
};

const authenticate = async (req: Request, res: Response) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const u = await userStore.authenticate(user.email, user.password);
    const userwithtoken = jwt.sign(
      { user: u },
      process.env.TOKEN_SECRET as jwt.Secret
    );
    const goal = await goalStore.getbyuser(u.id);
    res.json({
      id: u.id,
      username: u.username,
      email: u.email,
      userwithtoken: userwithtoken,
      goal,
    });
  } catch (error: unknown) {
    const { message } = error as Error;
    res.status(401).send({ message });
  }
};

const user_routes = (app: express.Application): void => {
  app.post("/signup", signup);
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.put("/users/:id", verifyAuthToken, update);
  app.put("/users/changepassword/:id", verifyAuthToken, changepassword);
  app.post("/signin", authenticate);
  // app.delete("/users/:id", verifyAuthToken, destroy);
};

export default user_routes;
