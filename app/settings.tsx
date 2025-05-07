import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Texts } from "../constants/Texts";
import { useTheme } from "./context/ThemeContext";
export default function SettingsScreen() {
  const router = useRouter();
  const { themeMode, setThemeMode, colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>設定</Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          主題設定
        </Text>
        <View style={styles.themeSelector}>
          <TouchableOpacity
            style={[
              styles.themeButton,
              {
                borderColor: colors.border,
                backgroundColor:
                  themeMode === "light" ? colors.selected : "transparent",
              },
            ]}
            onPress={() => setThemeMode("light")}
          >
            <Text style={{ color: colors.text }}>淺色</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeButton,
              {
                borderColor: colors.border,
                backgroundColor:
                  themeMode === "dark" ? colors.selected : "transparent",
              },
            ]}
            onPress={() => setThemeMode("dark")}
          >
            <Text style={{ color: colors.text }}>深色</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeButton,
              {
                borderColor: colors.border,
                backgroundColor:
                  themeMode === "system" ? colors.selected : "transparent",
              },
            ]}
            onPress={() => setThemeMode("system")}
          >
            <Text style={{ color: colors.text }}>系統</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>關於</Text>
        <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
          {Texts.app.name} {Texts.app.version}
          {"\n"}
          {Texts.app.description}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  themeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  themeButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
  },
  aboutText: {
    lineHeight: 24,
  },
});
