// From Udacity'JavaScript Developer Nanodegree edited by Tanhapon Tosirikul 2781155t
import express, { Request, Response } from "express";
import cors from "cors";
import user_routes from "./handlers/User";
import goal_routes from "./handlers/Goal";
import dailylog_routes from "./handlers/DailyFoodLog";
import foodvariant_routes from "./handlers/FoodVariant";
import food_routes from "./handlers/Food";
import { dashboard_routes } from "./handlers/Dashboard";

export const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response): void => {
  res.send("Home");
});

user_routes(app);
goal_routes(app);
dailylog_routes(app);
foodvariant_routes(app);
food_routes(app);
dashboard_routes(app);

app.get("*", (req: Request, res: Response): void => {
  res.send("No route");
});
