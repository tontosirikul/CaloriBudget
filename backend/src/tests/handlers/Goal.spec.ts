// From https://jestjs.io/docs/using-matchers edited by Tanhapon Tosirikul 2781155t
import supertest from "supertest";
import { app } from "../../app";
import { Goal } from "@prisma/client";
import dotenv from "dotenv";
import { Decimal } from "@prisma/client/runtime/library";

dotenv.config();

const request = supertest(app);

describe("Testing endpoints (Goal Handlers)", () => {
  let token: string;
  let id: number;
  let pastGoalID: number;
  let pastGoal: Goal;
  beforeAll(async () => {
    const mockUser = {
      email: "testgoal@test.com",
      password: "1234567890",
    };

    const response = await request.post("/signin").send(mockUser).expect(200);

    token = response.body.userwithtoken;
    id = response.body.id;
    pastGoalID = response.body.goal.id;
    pastGoal = response.body.goal;
  });
  const mockGoal: Omit<Goal, "id" | "user_id" | "createdAt"> = {
    carbs_percentage_goal: 35,
    fat_percentage_goal: 20,
    protein_percentage_goal: 40,
    carbs_gram_goal: new Decimal(153),
    fat_gram_goal: new Decimal(49),
    protein_gram_goal: new Decimal(175),
    calories_goal: new Decimal(1750),
    expense_limit: new Decimal(15),
  };

  it("shout not be able to create an missing goal", async () => {
    await request
      .post("/goals")
      .set("Authorization", "bearer " + token)
      .send({
        user_id: id,
      })
      .expect(400);
  });

  it("should create a new goal", async () => {
    const response = await request
      .post("/goals")
      .set("Authorization", "bearer " + token)
      .send({
        ...mockGoal,
        user_id: id,
      })
      .expect(200);
    expect({
      carbs_gram_goal: Number(response.body.goal.carbs_gram_goal),
      fat_gram_goal: Number(response.body.goal.fat_gram_goal),
      protein_gram_goal: Number(response.body.goal.protein_gram_goal),
      calories_goal: Number(response.body.goal.calories_goal),
      expense_limit: Number(response.body.goal.expense_limit),
    }).toEqual({
      carbs_gram_goal: Number(mockGoal.carbs_gram_goal),
      fat_gram_goal: Number(mockGoal.fat_gram_goal),
      protein_gram_goal: Number(mockGoal.protein_gram_goal),
      calories_goal: Number(mockGoal.calories_goal),
      expense_limit: Number(mockGoal.expense_limit),
    });
  });

  it("should not be able to get any goal of undefined user", async () => {
    await request
      .get(`/users/999/goals`)
      .set("Authorization", "bearer " + token)
      .expect(400);
  });

  it("should get a current goal of user", async () => {
    const response = await request
      .get(`/users/${id}/goals`)
      .set("Authorization", "bearer " + token)
      .expect(200);
    expect({
      carbs_gram_goal: Number(response.body.carbs_gram_goal),
      fat_gram_goal: Number(response.body.fat_gram_goal),
      protein_gram_goal: Number(response.body.protein_gram_goal),
      calories_goal: Number(response.body.calories_goal),
      expense_limit: Number(response.body.expense_limit),
    }).toEqual({
      carbs_gram_goal: Number(mockGoal.carbs_gram_goal),
      fat_gram_goal: Number(mockGoal.fat_gram_goal),
      protein_gram_goal: Number(mockGoal.protein_gram_goal),
      calories_goal: Number(mockGoal.calories_goal),
      expense_limit: Number(mockGoal.expense_limit),
    });
  });

  it("should get a past goal", async () => {
    const response = await request
      .get(`/goals/${pastGoalID}`)
      .set("Authorization", "bearer " + token)
      .expect(200);
    expect({
      carbs_gram_goal: Number(response.body.carbs_gram_goal),
      fat_gram_goal: Number(response.body.fat_gram_goal),
      protein_gram_goal: Number(response.body.protein_gram_goal),
      calories_goal: Number(response.body.calories_goal),
      expense_limit: Number(response.body.expense_limit),
    }).toEqual({
      carbs_gram_goal: Number(pastGoal.carbs_gram_goal),
      fat_gram_goal: Number(pastGoal.fat_gram_goal),
      protein_gram_goal: Number(pastGoal.protein_gram_goal),
      calories_goal: Number(pastGoal.calories_goal),
      expense_limit: Number(pastGoal.expense_limit),
    });
  });
});
