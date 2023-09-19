// From https://formidable.com/open-source/victory/docs/victory-bar edited by Tanhapon Tosirikul 2781155t
import { View } from "react-native";
import React, { useState } from "react";
import { useGetAverageDailyExpenseQuery } from "../services/DashboardService";
import Loading from "./Loading";
import { Center, Heading } from "native-base";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryCursorContainer,
  VictoryLegend,
} from "victory-native";
import { useUser } from "../libs/hook";
import { formatDecimal } from "../libs/formatDecimal";

interface AverageDailyExpenseChartProp {
  user_id: number | undefined;
  days: number;
}

const AverageDailyExpenseChart: React.FC<AverageDailyExpenseChartProp> = ({
  user_id,
  days,
}) => {
  const user = useUser();
  const { data, isLoading, isFetching, error, refetch } =
    useGetAverageDailyExpenseQuery(
      {
        user_id,
        days,
      },
      { refetchOnMountOrArgChange: true }
    );

  const [selectedX, setSelectedX] = useState<Date | null>(null);
  const [selectedY, setSelectedY] = useState<number[]>([]);

  const getClosestDataPointBefore = (chartData: any[], cursorDate: number) => {
    let beforeData = chartData.filter((datapoint) => datapoint.x <= cursorDate);

    if (beforeData.length === 0) {
      return null; // No data before cursorDate
    } else {
      return beforeData.reduce((prev, curr) =>
        Math.abs(curr.x - cursorDate) < Math.abs(prev.x - cursorDate)
          ? curr
          : prev
      );
    }
  };

  let content;
  if (isLoading || isFetching) {
    content = (
      <Center>
        <Loading />
      </Center>
    );
  }
  if (error) {
    content = (
      <Center>
        <Heading color="darkBlue.500" fontSize="lg">
          Chart Error{"\n"}
        </Heading>
      </Center>
    );
  }
  if (!data) {
    content = (
      <Center>
        <Heading color="darkBlue.500" fontSize="lg">
          Chart Error{"\n"}
        </Heading>
      </Center>
    );
  }
  if (data) {
    const chartData = data.map(
      (item: { date: string; totalExpense: number }) => {
        let date = new Date(item.date);
        date.setHours(0);
        return {
          x: date,
          y: item.totalExpense,
        };
      }
    );
    const nonZeroData = data.filter(
      (item: { totalExpense: number }) => item.totalExpense > 0
    );
    const average =
      nonZeroData.length > 0
        ? nonZeroData.reduce(
            (acc: any, item: { totalExpense: number }) =>
              acc + item.totalExpense,
            0
          ) / nonZeroData.length
        : 0;
    const maxExpense = Math.max(
      ...chartData.map((item: { y: number }) => item.y)
    );

    let maxVal =
      Math.max(maxExpense, user?.goal.expense_limit || maxExpense) * 1.2;
    let tickRange = 10 ** Math.floor(Math.log10(maxVal));
    let tickValues = Array.from(
      { length: Math.ceil(maxVal / tickRange) + 1 },
      (_, i) => i * tickRange
    );

    let avgIndex = Math.floor(average / tickRange);
    tickValues.splice(avgIndex, 0, parseFloat(average.toFixed(2)));

    let goalVal = parseFloat(user?.goal.expense_limit.toString() ?? "20");
    let goalIndex = Math.floor(goalVal / tickRange);
    tickValues.splice(goalIndex, 0, goalVal);
    tickValues.sort((a, b) => a - b);
    tickValues = [...new Set(tickValues)];
    avgIndex = tickValues.findIndex(
      (val) => val === parseFloat(average.toFixed(2))
    );
    goalIndex = tickValues.findIndex((val) => val === goalVal);

    content = (
      <>
        {isFetching ? (
          <Center width={390} height={600}>
            <Loading></Loading>
          </Center>
        ) : (
          <View>
            <Center margin={5}>
              <Heading>Average Expense: £ {average.toPrecision(3)}</Heading>
              <Heading>
                over the {days != 999 ? `last ${days} days` : "all time"}
              </Heading>
            </Center>
            <Center>
              <VictoryChart
                scale={{ x: "time", y: "linear" }}
                height={500}
                domainPadding={{ x: 20 }}
                containerComponent={
                  <VictoryCursorContainer
                    cursorDimension="x"
                    onCursorChange={(value: any) => {
                      if (value) {
                        const cursorDate = value;
                        const closestData = getClosestDataPointBefore(
                          chartData,
                          cursorDate
                        );
                        if (closestData && closestData.y > 0) {
                          setSelectedX(closestData.x);
                          setSelectedY(closestData.y);
                        }
                      }
                    }}
                  />
                }
              >
                <VictoryLegend
                  x={60}
                  y={40}
                  centerTitle
                  orientation="vertical"
                  gutter={20}
                  style={{
                    border: { stroke: "black" },
                    title: { fontSize: 10 },
                  }}
                  data={[
                    { name: "Expense limit", symbol: { fill: "red" } },
                    { name: "Average expense", symbol: { fill: "green" } },
                    // { name: "Expense", symbol: { fill: "#1a91ff" } },
                  ]}
                />
                <VictoryLegend
                  x={220}
                  y={40}
                  centerTitle
                  orientation="horizontal"
                  gutter={20}
                  style={{
                    border: { stroke: "black" },
                    title: { fontSize: 10 },
                  }}
                  data={[
                    {
                      name:
                        selectedY && selectedX
                          ? `£ ${selectedY} on ${selectedX?.toLocaleDateString()} `
                          : "No Expense Selected",
                      symbol: { fill: "#1a91ff" },
                    },
                  ]}
                />
                <VictoryAxis
                  tickFormat={(x) => {
                    const date = new Date(x);
                    return `${date.getDate()}-${date.getMonth() + 1}`;
                  }}
                  label="Date"
                  fixLabelOverlap
                  style={{
                    tickLabels: {
                      fontSize: 10,
                      angle: -45,
                    },
                    axisLabel: { padding: 30 },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  label="Expenses"
                  tickValues={tickValues}
                  style={{
                    axisLabel: { padding: 50 },
                    grid: {
                      stroke: ({ index }: { index: number }) =>
                        index == goalIndex ? "red" : "",
                    },
                    tickLabels: {
                      fontSize: 10,
                    },
                  }}
                  domain={{
                    y: [
                      0,
                      Math.max(
                        maxExpense,
                        user?.goal.expense_limit || maxExpense
                      ) * 1.2,
                    ],
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  label="Expenses"
                  tickValues={tickValues}
                  style={{
                    axisLabel: { padding: 30 },
                    grid: {
                      stroke: ({ index }: { index: number }) =>
                        index === avgIndex ? "green" : "",
                    },
                    tickLabels: {
                      fontSize: 10,
                    },
                  }}
                  domain={{
                    y: [
                      0,
                      Math.max(
                        maxExpense,
                        user?.goal.expense_limit || maxExpense
                      ) * 1.2,
                    ],
                  }}
                />

                <VictoryBar
                  name="bar"
                  style={{
                    data: { fill: "#1a91ff", opacity: 0.7 },
                  }}
                  data={chartData}
                  labels={
                    chartData.length <= 14
                      ? ({ datum }) =>
                          datum.y > 0 ? `${formatDecimal(datum.y)}` : ""
                      : () => ""
                  }
                  alignment="start"
                />
              </VictoryChart>
            </Center>
          </View>
        )}
      </>
    );
  }
  return <View>{content}</View>;
};

export default AverageDailyExpenseChart;
