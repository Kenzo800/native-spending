import { MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Texts } from "../constants/Texts";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
interface DrawerContentProps {
  navigation: {
    closeDrawer: () => void;
  };
}

function CustomDrawerContent(props: DrawerContentProps) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View
      style={[styles.drawerContainer, { backgroundColor: colors.background }]}
    >
      <DrawerContentScrollView style={styles.drawerScrollView}>
        <View style={styles.drawerHeader}>
          <Text style={[styles.drawerTitle, { color: colors.text }]}>
            {Texts.app.name}
          </Text>
        </View>

        <View style={styles.drawerContent}>
          {/* 這裡可以添加其他抽屜項目 */}
        </View>
      </DrawerContentScrollView>

      <View style={styles.drawerFooter}>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: colors.card }]}
          onPress={() => {
            props.navigation.closeDrawer();
            router.push("/settings");
          }}
        >
          <View style={styles.settingsContent}>
            <MaterialIcons
              name="settings"
              size={20}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.settingsText, { color: colors.text }]}>
              設定
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RootLayoutNav() {
  const { colors } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerType: "front",
        drawerStyle: {
          backgroundColor: colors.background,
          width: "70%",
        },
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: () => null,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: () => null,
        }}
      />
    </Drawer>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerScrollView: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  drawerContent: {
    flex: 1,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  settingsButton: {
    padding: 15,
    borderRadius: 8,
  },
  settingsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsText: {
    fontSize: 16,
  },
});
