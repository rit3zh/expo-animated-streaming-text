import { BubbleFlight } from "@/components/bubble-flight";
import { SidebarDrawer } from "@/components/sidebar-drawer";
import { SIDEBAR_SCREEN_OPTIONS } from "@/constants/components/sidebar-drawer.const";
import { PALETTE } from "@/constants/palette.const";
import { RADIX_GRAY } from "@/constants/radix.const";
import { THEME_NAVIGATION } from "@/constants/theme.const";
import { ThemeProvider } from "expo-router";
import { Drawer, type DrawerContentComponentProps } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import type { FC } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

const RootLayout: FC = (): React.ReactNode & React.JSX.Element => (
  <GestureHandlerRootView style={styles.root}>
    <KeyboardProvider>
      <ThemeProvider value={THEME_NAVIGATION}>
        <StatusBar style="light" />
        <Drawer
          screenOptions={SIDEBAR_SCREEN_OPTIONS}
          drawerContent={(
            props: DrawerContentComponentProps,
          ): React.JSX.Element => (
            <SidebarDrawer navigation={props.navigation} />
          )}
        >
          <Drawer.Screen name="index" options={{ title: "New chat" }} />
          <Drawer.Screen name="chat/[id]" options={{ title: "Chat" }} />
        </Drawer>
        <BubbleFlight colors={PALETTE.dark} />
      </ThemeProvider>
    </KeyboardProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: RADIX_GRAY[1] },
});

export default RootLayout;
