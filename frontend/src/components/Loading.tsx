// From https://docs.nativebase.io/spinner
import { View, Center, HStack, Spinner, Heading } from "native-base";

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Center>
        <HStack space={2} justifyContent="center">
          <Spinner
            accessibilityLabel="Loading data"
            size="lg"
            colorScheme={"darkBlue"}
          />
          <Heading color="darkBlue.500" fontSize="lg">
            Loading
          </Heading>
        </HStack>
      </Center>
    </View>
  );
};

export default Loading;
