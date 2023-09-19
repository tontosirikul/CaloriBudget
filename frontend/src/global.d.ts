// From https://frontendmasters.com/courses/advanced-redux/ edited by Tanhapon Tosirikul 2781155t
type RequireOnly<T, P extends keyof T> = Pick<T, P> & Partial<Omit<T, P>>;
enum MealType {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  SNACK = "SNACK",
}

type User = {
  id: string;
  email: string;
  username: string;
  hashed_password: string;
  dailyweights: DailyWeight[];
  goals: Goal[];
  dailyfoodlogs: DailyFoodLog[];
  foodvariants: FoodVariant[];
};

type DailyWeight = {
  id: string;
  weight: number;
  date: Date;
  user?: User;
};

type Goal = {
  id: string;
  carbs_percentage_goal: number;
  fat_percentage_goal: number;
  protein_percentage_goal: number;
  carbs_gram_goal: number;
  fat_gram_goal: number;
  protein_gram_goal: number;
  calories_goal: number;
  expense_limit: number;
  user?: User;
  dailyfoodlogs: DailyFoodLog[];
  createdAt: Date;
};

type Food = {
  id: string;
  brand: string;
  description: string;
  calories: number;
  carbs_gram: number;
  fat_gram: number;
  protein_gram: number;
  serving_size: string;
  isGeneric: boolean;
  foodvariants: FoodVariant[];
  barcode?: string;
};

type FoodVariant = {
  id: string;
  expense: number;
  foodentries: FoodEntry[];
  user?: User;
  food?: Food;
  brand_snapshot: string;
  description_snapshot: string;
  calories_snapshot: number;
  carbs_gram_snapshot: number;
  fat_gram_snapshot: number;
  protein_gram_snapshot: number;
  serving_size_snapshot: string;
};

type FoodEntry = {
  id: string;
  number_of_servings: number;
  meal_type: MealType;
  dailyfoodlog?: DailyFoodLog;
  foodvariant?: FoodVariant;
  brand_snapshot: string;
  description_snapshot: string;
  calories_snapshot: number;
  carbs_gram_snapshot: number;
  fat_gram_snapshot: number;
  protein_gram_snapshot: number;
  serving_size_snapshot: string;
  expense_snapshot: number;
};

type DailyFoodLog = {
  id: string;
  date: Date;
  goal?: Goal;
  user?: User;
  foodentries: FoodEntry[];
};

type Barcode = {
  id: string;
  barcode: string;
  food?: Food;
};

type UserWithGoal = {
  id: number;
  username: string;
  email: string;
  userwithtoken: string;
  goal: {
    id: number;
    carbs_percentage_goal: number;
    fat_percentage_goal: number;
    protein_percentage_goal: number;
    carbs_gram_goal: number;
    fat_gram_goal: number;
    protein_gram_goal: number;
    calories_goal: number;
    expense_limit: number;
  };
};

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  carbs_percentage_goal: number;
  fat_percentage_goal: number;
  protein_percentage_goal: number;
  carbs_gram_goal: number;
  fat_gram_goal: number;
  protein_gram_goal: number;
  calories_goal: number;
  expense_limit: number;
};

type GoalSettingData = {
  carbs_percentage_goal?: number;
  fat_percentage_goal?: number;
  protein_percentage_goal?: number;
  carbs_gram_goal?: number;
  fat_gram_goal?: number;
  protein_gram_goal?: number;
  calories_goal?: number;
  expense_limit?: number;
};

type CreateFoodData = {
  meal_type: number;
  brand: number;
  description: number;
  serving_size: number;
  expense: number;
  calories: number;
  carbs_gram: number;
  fat_gram: number;
  protein_gram: number;
  number_of_servings: number;
};

type RootStackParamList = {
  ProfileSetting;
  GoalSetting;
  ChangePassword;
  CreateFood;
  EditEntry: {
    entry_id: string;
    meal_type: string;
  };
  EditVariant: {
    foodvariant_id: string;
  };
  AddEntryByMyFood: {
    foodvariant_id: string;
  };
  AddEntryByProvidedFood: {
    food_id: string;
  };
  BarcodeScanner;
  CreateFoodByAPI: {
    brandFromAPI: string;
    descriptionFromAPI: string;
    caloriesFromAPI: number;
    carbs_gramFromAPI: number;
    fat_gramFromAPI: number;
    protein_gramFromAPI: number;
    barcodeFromAPI: string;
  };
  AverageDailyExpense;
};
