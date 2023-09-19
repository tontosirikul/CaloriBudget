// Created by Tanhapon Tosirikul 2781155t
import { Button, Center, HStack } from "native-base";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useUser } from "../../libs/hook";
import AverageDailyExpenseChart from "../../components/AverageDailyExpenseChart";

const AverageDailyExpense = () => {
  const user = useUser();
  const [days, setDays] = useState(7);

  return (
    <ScrollView style={styles.container}>
      <Center
        p="0.5"
        colorScheme="light50"
        bg="white"
        borderColor="gray"
        marginTop={1}
        flex={1}
      >
        {/* <Heading m={1}>
          From {data[0].x} to {data[data.length - 1].x}
        </Heading> */}

        {/* <AverageTwo user_id={user?.id} days={days} /> */}
        <AverageDailyExpenseChart user_id={user?.id} days={days} />
        <HStack justifyContent="space-around" justifyItems="center" space={4}>
          <Button
            onPress={() => setDays(7)}
            background={days == 7 ? "darkBlue.300" : "darkBlue.500"}
          >
            1W
          </Button>
          <Button
            onPress={() => setDays(14)}
            background={days == 14 ? "darkBlue.300" : "darkBlue.500"}
            isDisabled={days == 14 ? true : false}
          >
            2W
          </Button>
          <Button
            onPress={() => setDays(30)}
            background={days == 30 ? "darkBlue.300" : "darkBlue.500"}
            isDisabled={days == 30 ? true : false}
          >
            1M
          </Button>
          <Button
            onPress={() => setDays(90)}
            background={days == 90 ? "darkBlue.300" : "darkBlue.500"}
            isDisabled={days == 90 ? true : false}
          >
            3M
          </Button>
          <Button
            onPress={() => setDays(365)}
            background={days == 365 ? "darkBlue.300" : "darkBlue.500"}
            isDisabled={days == 365 ? true : false}
          >
            1Y
          </Button>
          <Button
            onPress={() => setDays(999)}
            background={days == 999 ? "darkBlue.300" : "darkBlue.500"}
            isDisabled={days == 999 ? true : false}
          >
            ALL
          </Button>
        </HStack>
      </Center>
    </ScrollView>
  );
};

export default AverageDailyExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
