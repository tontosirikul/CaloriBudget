// from https://www.npmjs.com/package/react-native-modal-datetime-picker edited by Tanhapon Tosirikul 2781155t
import React, { useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Center, HStack, Text, View } from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from "@expo/vector-icons";
import { setDate } from "../features/slices/dateSlice";
import { RootState, useAppThunkDispatch } from "../features/store";
import { useSelector } from "react-redux";

export const DatePicker: React.FC = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const dateString = useSelector((state: RootState) => state.date.date);
  const date = useMemo(() => new Date(dateString), [dateString]);
  const dispatch = useAppThunkDispatch();
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    dispatch(setDate(date.toISOString()));
    hideDatePicker();
  };

  const handleDateBackward = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    dispatch(setDate(newDate.toISOString()));
  };

  const handleDateForward = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    dispatch(setDate(newDate.toISOString()));
  };

  return (
    <>
      {/* <TouchableOpacity onPress={showDatePicker}> */}
      <HStack>
        <TouchableOpacity onPress={handleDateBackward}>
          <View>
            <Center marginRight="3">
              <FontAwesome name="caret-left" size={30} color="black" />
            </Center>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={showDatePicker}>
          <HStack>
            <Text fontSize="md" fontWeight="semibold">
              {date
                ? date.toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No date selected"}
            </Text>
            <Center marginLeft="3">
              <FontAwesome name="caret-down" size={20} color="black" />
            </Center>
          </HStack>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDateForward}>
          <View>
            <Center marginLeft="3">
              <FontAwesome name="caret-right" size={30} color="black" />
            </Center>
          </View>
        </TouchableOpacity>
      </HStack>
      {/* </TouchableOpacity> */}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={date}
      />
    </>
  );
};
