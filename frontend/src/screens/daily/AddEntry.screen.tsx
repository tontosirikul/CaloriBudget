// From https://reactnavigation.org/docs/tab-view/ edited by Tanhapon Tosirikul 2781155t
import * as React from "react";
import {
  Dimensions,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import {
  TabView,
  TabBar,
  NavigationState,
  Route,
  SceneRendererProps,
  TabBarIndicatorProps,
  TabBarItemProps,
} from "react-native-tab-view";
import All from "./AddEntryTabs/All.tab";
// import History from "./AddEntryTabs/History.tab";
import MyFoods from "./AddEntryTabs/MyFoods.tab";
import { Scene, Event } from "react-native-tab-view/lib/typescript/src/types";

const initialLayout = { width: Dimensions.get("window").width };

const AddEntry = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "all", title: "All Foods" },
    { key: "myfoods", title: "My Foods & Expense" },
  ]);

  const renderScene = ({
    route,
  }: {
    route: { key: string; title: string };
  }) => {
    switch (route.key) {
      case "all":
        return <All />;
      case "myfoods":
        return <MyFoods />;
      default:
        return null;
    }
  };

  const renderTabBar = (
    props: JSX.IntrinsicAttributes &
      SceneRendererProps & {
        navigationState: NavigationState<Route>;
        scrollEnabled?: boolean | undefined;
        bounces?: boolean | undefined;
        activeColor?: string | undefined;
        inactiveColor?: string | undefined;
        pressColor?: string | undefined;
        pressOpacity?: number | undefined;
        getLabelText?:
          | ((scene: Scene<Route>) => string | undefined)
          | undefined;
        getAccessible?:
          | ((scene: Scene<Route>) => boolean | undefined)
          | undefined;
        getAccessibilityLabel?:
          | ((scene: Scene<Route>) => string | undefined)
          | undefined;
        getTestID?: ((scene: Scene<Route>) => string | undefined) | undefined;
        renderLabel?:
          | ((
              scene: Scene<Route> & { focused: boolean; color: string }
            ) => React.ReactNode)
          | undefined;
        renderIcon?:
          | ((
              scene: Scene<Route> & { focused: boolean; color: string }
            ) => React.ReactNode)
          | undefined;
        renderBadge?: ((scene: Scene<Route>) => React.ReactNode) | undefined;
        renderIndicator?:
          | ((props: TabBarIndicatorProps<Route>) => React.ReactNode)
          | undefined;
        renderTabBarItem?:
          | ((
              props: TabBarItemProps<Route> & { key: string }
            ) => React.ReactElement<
              any,
              string | React.JSXElementConstructor<any>
            >)
          | undefined;
        onTabPress?: ((scene: Scene<Route> & Event) => void) | undefined;
        onTabLongPress?: ((scene: Scene<Route>) => void) | undefined;
        tabStyle?: StyleProp<ViewStyle>;
        indicatorStyle?: StyleProp<ViewStyle>;
        indicatorContainerStyle?: StyleProp<ViewStyle>;
        labelStyle?: StyleProp<TextStyle>;
        contentContainerStyle?: StyleProp<ViewStyle>;
        style?: StyleProp<ViewStyle>;
        gap?:
          | number // styling for the text color of the inactive tab
          | undefined;
        testID?: string | undefined;
        android_ripple?: PressableAndroidRippleConfig | undefined;
      }
  ) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#0077e6" }} // styling for the lower line of the active tab
      style={{ backgroundColor: "white" }} // styling for the background of the tab bar
      activeColor="#0077e6" // styling for the text color of the active tab
      inactiveColor="gray" // styling for the text color of the inactive tab
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      initialLayout={initialLayout}
    />
  );
};

export default AddEntry;
