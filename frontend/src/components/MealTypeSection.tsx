// Created by Tanhapon Tosirikul 2781155t
import { Heading } from "native-base";

interface MealTypeSectionProps {
  section: {
    mealtype: string;
    mealtypeCaloriesSum: number;
    mealtypeExpenseSum: number;
  };
}

const MealTypeSection: React.FC<MealTypeSectionProps> = ({ section }) => {
  return (
    <Heading fontSize="md" p={2} my={1} bg="#FFFFFF" shadow={1}>
      {section.mealtype} - Calories: {section.mealtypeCaloriesSum} kcal,
      Expense: £ {section.mealtypeExpenseSum}
    </Heading>
  );
};

export default MealTypeSection;
