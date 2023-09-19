// From https://jestjs.io/docs/using-matchers edited by Tanhapon Tosirikul 2781155t
import supertest from "supertest";
import { app } from "../../app";
import dotenv from "dotenv";
import prisma from "../../prisma";

dotenv.config();

const request = supertest(app);

describe("Testing endpoints (Daily Food Log Handlers)", () => {
  let token: string;
  let id: number;
  let goalID: number;
  let foodvariantID: number;
  let foodentriesIDofCreateFood: number;
  let foodentriesIDofExpenseDefinedFood: number;
  let foodentriesIDofProvidedFood: number;
  let foodID: number;

  beforeAll(async () => {
    const mockUser = {
      email: "testdailyfoodlog@test.com",
      password: "1234567890",
    };
    const response = await request.post("/signin").send(mockUser).expect(200);
    token = response.body.userwithtoken;
    id = response.body.id;
    goalID = response.body.goal.id;
  });

  it("should not list entries of non-existed log", async () => {
    const response = await request
      .get("/dailylog")
      .set("Authorization", `Bearer ${token}`)
      .query({
        date: "2023-08-05",
        user_id: id,
      })
      .expect(400);
  });

  it("should create user defined food with its variant and entry into daily log", async () => {
    const requestData = {
      meal_type: "BREAKFAST",
      brand: "HealthyBrand",
      description: "Delicious Oatmeal",
      serving_size: "150 g",
      expense: "3.5",
      calories: "250",
      carbs_gram: "40",
      fat_gram: "5",
      protein_gram: "10",
      number_of_servings: "1",
      isGeneric: false,
      barcode: "",
      goal_id: goalID,
      user_id: id,
      date: "2023-08-05",
    };
    const response = await request
      .post("/dailylog/createfood")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...requestData,
      })
      .expect(200);
    foodvariantID = response.body.dailyfoodlog.foodentries[0].foodvariant_id;
    foodentriesIDofCreateFood = response.body.dailyfoodlog.foodentries[0].id;
    expect({
      date: new Date(response.body.dailyfoodlog.date).toDateString,
      goal_id: response.body.dailyfoodlog.goal_id,
      user_id: response.body.dailyfoodlog.user_id,
    }).toEqual({
      date: new Date(requestData.date).toDateString,
      goal_id: requestData.goal_id,
      user_id: requestData.user_id,
    });
    expect({
      number_of_servings:
        response.body.dailyfoodlog.foodentries[0].number_of_servings,
      meal_type: response.body.dailyfoodlog.foodentries[0].meal_type,
      brand: response.body.dailyfoodlog.foodentries[0].brand_snapshot,
      description:
        response.body.dailyfoodlog.foodentries[0].description_snapshot,
      calories: response.body.dailyfoodlog.foodentries[0].calories_snapshot,
      carbs_gram: response.body.dailyfoodlog.foodentries[0].carbs_gram_snapshot,
      fat_gram: response.body.dailyfoodlog.foodentries[0].fat_gram_snapshot,
      protein_gram:
        response.body.dailyfoodlog.foodentries[0].protein_gram_snapshot,
      serving_size:
        response.body.dailyfoodlog.foodentries[0].serving_size_snapshot,
      expense: response.body.dailyfoodlog.foodentries[0].expense_snapshot,
    }).toEqual({
      meal_type: requestData.meal_type,
      brand: requestData.brand,
      description: requestData.description,
      serving_size: requestData.serving_size,
      expense: requestData.expense,
      calories: requestData.calories,
      carbs_gram: requestData.carbs_gram,
      fat_gram: requestData.fat_gram,
      protein_gram: requestData.protein_gram,
      number_of_servings: requestData.number_of_servings,
    });
  });

  it("should create entry by using expense-defined food", async () => {
    const foodvariant = await prisma.foodVariant.findUnique({
      where: { id: foodvariantID },
    });
    const mockFoodEntry = {
      meal_type: "DINNER",
      number_of_servings: "2",
      foodvariant_id: foodvariantID,
      expense: "4.5",
      brand: foodvariant?.brand_snapshot,
      description: foodvariant?.description_snapshot,
      calories: foodvariant?.calories_snapshot,
      carbs_gram: foodvariant?.carbs_gram_snapshot,
      fat_gram: foodvariant?.fat_gram_snapshot,
      protein_gram: foodvariant?.protein_gram_snapshot,
      serving_size: foodvariant?.serving_size_snapshot,
    };
    const response = await request
      .post("/dailylog/createentry/myfood")
      .set("Authorization", `Bearer ${token}`)
      .send({
        date: "2023-08-05",
        goal_id: goalID,
        user_id: id,
        ...mockFoodEntry,
      })
      .expect(200);
    foodentriesIDofExpenseDefinedFood =
      response.body.dailyfoodlog.foodentries[1].id;
    expect(Array.isArray(response.body.dailyfoodlog.foodentries)).toBe(true);
    expect(response.body.dailyfoodlog.foodentries.length).toBe(2);
    expect({
      date: new Date(response.body.dailyfoodlog.date).toDateString,
      goal_id: response.body.dailyfoodlog.goal_id,
      user_id: response.body.dailyfoodlog.user_id,
    }).toEqual({
      date: new Date("2023-08-05").toDateString,
      goal_id: goalID,
      user_id: id,
    });
    expect({
      number_of_servings: Number(
        response.body.dailyfoodlog.foodentries[1].number_of_servings
      ),
      meal_type: response.body.dailyfoodlog.foodentries[1].meal_type,
      brand: response.body.dailyfoodlog.foodentries[1].brand_snapshot,
      description:
        response.body.dailyfoodlog.foodentries[1].description_snapshot,
      calories: Number(
        response.body.dailyfoodlog.foodentries[1].calories_snapshot
      ),
      carbs_gram: Number(
        response.body.dailyfoodlog.foodentries[1].carbs_gram_snapshot
      ),
      fat_gram: Number(
        response.body.dailyfoodlog.foodentries[1].fat_gram_snapshot
      ),
      protein_gram: Number(
        response.body.dailyfoodlog.foodentries[1].protein_gram_snapshot
      ),
      serving_size:
        response.body.dailyfoodlog.foodentries[1].serving_size_snapshot,
      expense: Number(
        response.body.dailyfoodlog.foodentries[1].expense_snapshot
      ),
    }).toEqual({
      number_of_servings: Number(mockFoodEntry.number_of_servings),
      meal_type: mockFoodEntry.meal_type,
      brand: mockFoodEntry.brand,
      description: mockFoodEntry.description,
      calories: Number(mockFoodEntry.calories),
      carbs_gram: Number(mockFoodEntry.carbs_gram),
      fat_gram: Number(mockFoodEntry.fat_gram),
      protein_gram: Number(mockFoodEntry.protein_gram),
      serving_size: mockFoodEntry.serving_size,
      expense: Number(mockFoodEntry.expense),
    });
  });

  it("should not be able to create entry by misssing food", async () => {
    await request
      .post("/dailylog/createentry/providedfood")
      .set("Authorization", `Bearer ${token}`)
      .send({
        date: "2023-08-05",
        goal_id: goalID,
        user_id: id,
      })
      .expect(400);
  });

  it("should create entry by using provided food", async () => {
    const providedFood = await prisma.food.findFirst({
      where: { brand: "Hi Di Lao", description: "Hotpot Seasoning" },
    });

    const mockFoodEntry = {
      meal_type: "LUNCH",
      number_of_servings: "3",
      expense: "4.5",
      brand: providedFood?.brand,
      description: providedFood?.description,
      calories: providedFood?.calories,
      carbs_gram: providedFood?.carbs_gram,
      fat_gram: providedFood?.fat_gram,
      protein_gram: providedFood?.protein_gram,
      serving_size: providedFood?.serving_size,
    };

    const response = await request
      .post("/dailylog/createentry/providedfood")
      .set("Authorization", `Bearer ${token}`)
      .send({
        date: "2023-08-05",
        goal_id: goalID,
        user_id: id,
        ...mockFoodEntry,
        food_id: providedFood?.id,
      })
      .expect(200);
    foodentriesIDofProvidedFood = response.body.dailyfoodlog.foodentries[2].id;
    expect(Array.isArray(response.body.dailyfoodlog.foodentries)).toBe(true);
    expect(response.body.dailyfoodlog.foodentries.length).toBe(3);
    expect({
      date: new Date(response.body.dailyfoodlog.date).toDateString,
      goal_id: response.body.dailyfoodlog.goal_id,
      user_id: response.body.dailyfoodlog.user_id,
    }).toEqual({
      date: new Date("2023-08-05").toDateString,
      goal_id: goalID,
      user_id: id,
    });
    expect({
      number_of_servings: Number(
        response.body.dailyfoodlog.foodentries[2].number_of_servings
      ),
      meal_type: response.body.dailyfoodlog.foodentries[2].meal_type,
      brand: response.body.dailyfoodlog.foodentries[2].brand_snapshot,
      description:
        response.body.dailyfoodlog.foodentries[2].description_snapshot,
      calories: Number(
        response.body.dailyfoodlog.foodentries[2].calories_snapshot
      ),
      carbs_gram: Number(
        response.body.dailyfoodlog.foodentries[2].carbs_gram_snapshot
      ),
      fat_gram: Number(
        response.body.dailyfoodlog.foodentries[2].fat_gram_snapshot
      ),
      protein_gram: Number(
        response.body.dailyfoodlog.foodentries[2].protein_gram_snapshot
      ),
      serving_size:
        response.body.dailyfoodlog.foodentries[2].serving_size_snapshot,
      expense: Number(
        response.body.dailyfoodlog.foodentries[2].expense_snapshot
      ),
    }).toEqual({
      number_of_servings: Number(mockFoodEntry.number_of_servings),
      meal_type: mockFoodEntry.meal_type,
      brand: mockFoodEntry.brand,
      description: mockFoodEntry.description,
      calories: Number(mockFoodEntry.calories),
      carbs_gram: Number(mockFoodEntry.carbs_gram),
      fat_gram: Number(mockFoodEntry.fat_gram),
      protein_gram: Number(mockFoodEntry.protein_gram),
      serving_size: mockFoodEntry.serving_size,
      expense: Number(mockFoodEntry.expense),
    });
  });

  it("should list entries of log seperated by meal type", async () => {
    const response = await request
      .get("/dailylog")
      .set("Authorization", `Bearer ${token}`)
      .query({
        date: "2023-08-05",
        user_id: id,
      })
      .expect(200);

    expect(Array.isArray(response.body.foodentries)).toBe(true);
    expect(response.body.foodentries.length).toEqual(3);
    expect(response.body.foodentries[0].data.length).toEqual(1);
    expect(response.body.foodentries[1].data.length).toEqual(1);
    expect(response.body.foodentries[2].data.length).toEqual(1);
    expect(response.body.foodentries[3]).toBeUndefined();
  });

  it("should update a food entry", async () => {
    const editData = {
      meal_type: "SNACK",
      number_of_servings: "3",
      expense_snapshot: "4.5",
    };
    const response = await request
      .put(`/editfoodentry/${foodentriesIDofProvidedFood}`)
      .set("Authorization", `Bearer ${token}`)
      .send(editData)
      .expect(200);

    expect({
      meal_type: response.body.meal_type,
      number_of_servings: response.body.number_of_servings,
      expense_snapshot: response.body.expense_snapshot,
    }).toEqual(editData);
  });

  it("should delete a food entry", async () => {
    await request
      .delete(`/deletefoodentry/${foodentriesIDofProvidedFood}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should delete a daily log when there is no food entry left", async () => {
    await request
      .delete(`/deletefoodentry/${foodentriesIDofCreateFood}`)
      .set("Authorization", `Bearer ${token}`);
    await request
      .delete(`/deletefoodentry/${foodentriesIDofExpenseDefinedFood}`)
      .set("Authorization", `Bearer ${token}`);
    const response = await request
      .get("/dailylog")
      .set("Authorization", `Bearer ${token}`)
      .query({
        date: "2023-08-05",
        user_id: id,
      })
      .expect(400);
  });
});
