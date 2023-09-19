// From https://jestjs.io/docs/using-matchers edited by Tanhapon Tosirikul 2781155t
import supertest from "supertest";
import { app } from "../../app"; // Ensure this path is correct
import dotenv from "dotenv";
import prisma from "../../prisma";
import { Decimal } from "@prisma/client/runtime";

dotenv.config();

const request = supertest(app);

describe("Testing endpoints (Food Variant Handlers)", () => {
  let token: string;
  let id: number;
  let foodvariant: {
    id: any;
    expense?: Decimal;
    user_id?: number;
    food_id?: number;
    brand_snapshot?: string | null;
    description_snapshot?: string;
    calories_snapshot?: Decimal;
    carbs_gram_snapshot?: Decimal;
    fat_gram_snapshot?: Decimal;
    protein_gram_snapshot?: Decimal;
    serving_size_snapshot?: string;
  };

  beforeAll(async () => {
    const mockUser = {
      email: "testfoodvariant@test.com",
      password: "1234567890",
    };
    const response = await request.post("/signin").send(mockUser).expect(200);
    token = response.body.userwithtoken;
    id = response.body.id;

    const food = await prisma.food.findFirst({
      where: { brand: "The Coca-Cola Company", description: "Diet coke" },
    });

    await prisma.foodVariant.deleteMany({
      where: { user_id: id },
    });

    foodvariant = await prisma.foodVariant.create({
      data: {
        expense: 0.5,
        user_id: id,
        food_id: food?.id || 999,
        brand_snapshot: food?.brand,
        description_snapshot: food?.description || "Diet coke",
        calories_snapshot: food?.calories || 0.4,
        carbs_gram_snapshot: food?.carbs_gram || 0,
        fat_gram_snapshot: food?.fat_gram || 0,
        protein_gram_snapshot: food?.protein_gram || 0,
        serving_size_snapshot: food?.serving_size || "100 g/ml",
      },
    });
  });

  it("should get empty list all food variants of an undefined user", async () => {
    const response = await request
      .get(`/foodvariant/999`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(0);
  });

  it("should list all food variants of a user", async () => {
    const response = await request
      .get(`/foodvariant/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should update a food variant of valid data", async () => {
    const response = await request
      .put(`/foodvariant/${foodvariant.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ expense: 1 });
    expect(response.status).toBe(200);
    expect(Number(response.body.expense)).toEqual(1);
  });

  it("should not be able to delete an undefined food variant", async () => {
    const response = await request
      .delete(`/foodvariant/999`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it("should delete a food variant", async () => {
    const response = await request
      .delete(`/foodvariant/${foodvariant.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it("should not update a food variant with negative number", async () => {
    const response = await request
      .put(`/foodvariant/${foodvariant.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ expense: -1 });
    expect(response.status).toBe(400);
  });
});
