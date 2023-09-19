// From https://jestjs.io/docs/using-matchers edited by Tanhapon Tosirikul 2781155t
import supertest from "supertest";
import { app } from "../../app";
import dotenv from "dotenv";
import prisma from "../../prisma";

dotenv.config();

const request = supertest(app);

describe("Testing endpoints (Dashboard Handlers)", () => {
  let token: string;
  let id: number;

  beforeAll(async () => {
    const mockUser = {
      email: "testdashboard@test.com",
      password: "1234567890",
    };
    const response = await request.post("/signin").send(mockUser).expect(200);
    token = response.body.userwithtoken;
    id = response.body.id;
  });

  it("should get average daily expense", async () => {
    const response = await request
      .get(`/dashboard/averagedailyexpense/75/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(75);
  });

  it("should get all average daily expense", async () => {
    const response = await request
      .get(`/dashboard/averagedailyexpense/999/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should not get average daily expense by negative value", async () => {
    const response = await request
      .get(`/dashboard/averagedailyexpense/-1/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });

  it("should get weekly summary", async () => {
    const today = new Date().toISOString;
    const response = await request
      .get(`/dashboard/weeklysummary/${today}/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(7);
  });
});
