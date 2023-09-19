// From https://jestjs.io/docs/using-matchers edited by Tanhapon Tosirikul 2781155t
import supertest from "supertest";
import { app } from "../../app";
import dotenv from "dotenv";
import prisma from "../../prisma";
import { Food } from "@prisma/client";

dotenv.config();

const request = supertest(app);

describe("Testing endpoints (Food Handlers)", () => {
  let token: string;
  let id: number;
  let food: Food | null;

  beforeAll(async () => {
    const mockUser = {
      email: "testfood@test.com",
      password: "1234567890",
    };
    food = await prisma.food.findFirst({
      where: { brand: "The Coca-Cola Company", description: "Diet coke" },
    });

    const response = await request.post("/signin").send(mockUser).expect(200);
    token = response.body.userwithtoken;
    id = response.body.id;
  });

  it("should list all foods of a user", async () => {
    const response = await request
      .get(`/users/${id}/food`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    // just in case created food on daily food log is still in DB.
    expect([5, 6]).toContain(response.body.length);
  });

  it("should get food by barcode", async () => {
    const response = await request
      .get(`/users/${id}/barcode/${food?.barcode}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(response.body.id).toEqual(food?.id);
  });

  it("should not get food by invalid barcode", async () => {
    const response = await request
      .get(`/users/${id}/barcode/qwertyuiop`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(response.body).toEqual(null);
  });
});
