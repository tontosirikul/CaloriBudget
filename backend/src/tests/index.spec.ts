// From https://jestjs.io/docs/using-matchers edited by Tanhapon Tosirikul 2781155t
import supertest from "supertest";
import { app } from "../app";

const request = supertest(app);

describe("Testing endpoint (Home Handlers)", () => {
  it("home endpoint should be available", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Home");
  });
  it("access to no route should be indicated", async () => {
    const response = await request.get("/test");
    expect(response.status).toBe(200);
    expect(response.text).toBe("No route");
  });
});
