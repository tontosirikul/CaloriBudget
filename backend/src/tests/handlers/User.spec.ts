// From https://jestjs.io/docs/using-matchers edited by Tanhapon Tosirikul 2781155t
import supertest from "supertest";
import { app } from "../../app";
import { Goal } from "@prisma/client";
import dotenv from "dotenv";
import { Decimal } from "@prisma/client/runtime/library";
import { response } from "express";

dotenv.config();

const request = supertest(app);

describe("Testing endpoints (User Handlers)", () => {
  // mock user for testing user
  const mockUser = {
    email: "testuser@test.com",
    username: "testuser",
    password: "1234567890",
  };

  const mockGoal: Omit<Goal, "id" | "user_id" | "createdAt"> = {
    carbs_percentage_goal: 50,
    fat_percentage_goal: 20,
    protein_percentage_goal: 30,
    carbs_gram_goal: new Decimal(250),
    fat_gram_goal: new Decimal(44),
    protein_gram_goal: new Decimal(150),
    calories_goal: new Decimal(2000),
    expense_limit: new Decimal(20),
  };
  let token: string;
  let id: number;

  beforeAll(async () => {
    const mockUser = {
      email: "test@test.com",
      password: "1234567890",
    };
    const response = await request.post("/signin").send(mockUser).expect(200);
    token = response.body.userwithtoken;
  });

  it("should get all users", async () => {
    const response = await request
      .get(`/users`)
      .expect(200)
      .set("Authorization", "bearer " + token);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(6);
    expect({
      username: response.body[0].username,
      email: response.body[0].email,
    }).toEqual({ username: "test", email: "test@test.com" });
    expect({
      username: response.body[1].username,
      email: response.body[1].email,
    }).toEqual({
      username: "testdailyfoodlog",
      email: "testdailyfoodlog@test.com",
    });
    expect({
      username: response.body[2].username,
      email: response.body[2].email,
    }).toEqual({
      username: "testfood",
      email: "testfood@test.com",
    });
    expect({
      username: response.body[3].username,
      email: response.body[3].email,
    }).toEqual({
      username: "testfoodvariant",
      email: "testfoodvariant@test.com",
    });
    expect({
      username: response.body[4].username,
      email: response.body[4].email,
    }).toEqual({
      username: "testgoal",
      email: "testgoal@test.com",
    });
    expect({
      username: response.body[5].username,
      email: response.body[5].email,
    }).toEqual({ username: "testdashboard", email: "testdashboard@test.com" });
  });

  it("should not create user with invalid email", async () => {
    await request
      .post("/signup")
      .send({ email: "mockemail", password: "1234567890" })
      .expect(400);
  });

  it("should not create user without goal", async () => {
    await request
      .post("/signup")
      .send({ email: "mockemail@gmail.com", password: "1234567890" })
      .expect(400);
  });

  it("should not create account for duplicated email", async () => {
    const response = await request
      .post(`/signup`)
      .send({
        email: "testfood@test.com",
        username: "testtesttest",
        password: "1234567890",
        ...mockGoal,
      })
      .expect(400);
  });

  it("should create user with goal", async () => {
    const response = await request
      .post("/signup")
      .send({ ...mockUser, ...mockGoal })
      .expect(200);
    token = response.body.userwithtoken;
    id = response.body.id;
    expect({
      username: response.body.username,
      email: response.body.email,
    }).toEqual({ username: mockUser.username, email: mockUser.email });
    expect({
      expense_limit: Number(response.body.goal.expense_limit),
      calories_goal: Number(response.body.goal.calories_goal),
      carbs_gram_goal: Number(response.body.goal.carbs_gram_goal),
      fat_gram_goal: Number(response.body.goal.fat_gram_goal),
      protein_gram_goal: Number(response.body.goal.protein_gram_goal),
    }).toEqual({
      expense_limit: Number(mockGoal.expense_limit),
      calories_goal: Number(mockGoal.calories_goal),
      carbs_gram_goal: Number(mockGoal.carbs_gram_goal),
      fat_gram_goal: Number(mockGoal.fat_gram_goal),
      protein_gram_goal: Number(mockGoal.protein_gram_goal),
    });
  });

  it("should authenticate created user", async () => {
    await request
      .post("/signin")
      .send({ email: mockUser.email, password: mockUser.password })
      .expect(200);
  });

  it("should not authenticate undefined user", async () => {
    await request
      .post("/signin")
      .send({ email: "random", password: "random12345" })
      .expect(401);
  });

  it("should get created user", async () => {
    const response = await request
      .get(`/users/${id}`)
      .expect(200)
      .set("Authorization", "bearer " + token);
    expect({
      username: response.body.username,
      email: response.body.email,
    }).toEqual({ username: mockUser.username, email: mockUser.email });
  });

  it("should update email and username", async () => {
    const response = await request
      .put(`/users/${id}`)
      .send({ email: "tonydude@gmail.com", username: "hellokitty" })
      .expect(200)
      .set("Authorization", "bearer " + token);
    token = response.body.userwithtoken;
    expect({
      username: response.body.username,
      email: response.body.email,
      id: response.body.id,
    }).toEqual({ id: id, username: "hellokitty", email: "tonydude@gmail.com" });
  });

  it("should not change password with valid old password", async () => {
    await request
      .put(`/users/changepassword/${id}`)
      .send({ oldpassword: "1234567899", newpassword: "11111111" })
      .set("Authorization", "bearer " + token)
      .expect(400);
  });

  it("should not change password of undefined user", async () => {
    await request
      .put(`/users/changepassword/999`)
      .send({ oldpassword: "1234567890", newpassword: "11111111" })
      .set("Authorization", "bearer " + token)
      .expect(400);
  });

  it("should change password", async () => {
    await request
      .put(`/users/changepassword/${id}`)
      .send({ oldpassword: "1234567890", newpassword: "11111111" })
      .set("Authorization", "bearer " + token)
      .expect(200);
  });

  it("should authenticate with new password", async () => {
    const response = await request
      .post("/signin")
      .send({ email: "tonydude@gmail.com", password: "11111111" })
      .expect(200);
    token = response.body.userwithtoken;
  });

  it("should not update email and username of null", async () => {
    const response = await request
      .put(`/users/${id}`)
      .send({ email: null, username: null })
      .set("Authorization", "bearer " + token)
      .expect(400);
  });

  it("should not update duplicated email or username", async () => {
    const response = await request
      .put(`/users/${id}`)
      .send({ email: "testfood@test.com", username: "testfood" })
      .set("Authorization", "bearer " + token)
      .expect(400);
  });

  it("should not authenticate with old password", async () => {
    await request
      .post("/signin")
      .send({ email: "tonydude@gmail.com", password: "1234567890" })
      .expect(401);
  });
});
