import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Texts } from "../constants/Texts";
import { useTheme } from "./context/ThemeContext";
interface Transaction {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem("transactions");
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      Alert.alert("錯誤", "無法載入交易記錄");
    }
  };

  const saveTransactions = async (newTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(newTransactions)
      );
      setTransactions(newTransactions);
    } catch (error) {
      Alert.alert("錯誤", "無法儲存交易記錄");
    }
  };

  const addTransaction = async () => {
    if (!amount || !description || !category) {
      Alert.alert("錯誤", "請填寫所有欄位");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type,
      category,
      amount: parseFloat(amount),
      description,
    };

    try {
      await saveTransactions([...transactions, newTransaction]);
      setAmount("");
      setDescription("");
      setCategory("");
    } catch (error) {
      Alert.alert("錯誤", "無法新增交易記錄");
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await saveTransactions(transactions.filter((t) => t.id !== id));
    } catch (error) {
      Alert.alert("錯誤", "無法刪除交易記錄");
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {Texts.app.name}
        </Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Text style={[styles.menuButtonText, { color: colors.text }]}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.summary, { backgroundColor: colors.card }]}>
        <Text style={[styles.summaryText, { color: colors.text }]}>
          收入: ${totalIncome.toFixed(2)}
        </Text>
        <Text style={[styles.summaryText, { color: colors.text }]}>
          支出: ${totalExpense.toFixed(2)}
        </Text>
      </View>

      <View style={[styles.form, { backgroundColor: colors.card }]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="金額"
          placeholderTextColor={colors.textSecondary}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="描述"
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="類別"
          placeholderTextColor={colors.textSecondary}
          value={category}
          onChangeText={setCategory}
        />
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              { borderColor: colors.border },
              type === "income" && { backgroundColor: colors.selected },
            ]}
            onPress={() => setType("income")}
          >
            <Text style={{ color: colors.text }}>收入</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              { borderColor: colors.border },
              type === "expense" && { backgroundColor: colors.selected },
            ]}
            onPress={() => setType("expense")}
          >
            <Text style={{ color: colors.text }}>支出</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.button }]}
          onPress={addTransaction}
        >
          <Text style={styles.addButtonText}>新增</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.transactionList}>
        {transactions.map((transaction) => (
          <View
            key={transaction.id}
            style={[styles.transactionItem, { backgroundColor: colors.card }]}
          >
            <View>
              <Text
                style={[styles.transactionDescription, { color: colors.text }]}
              >
                {transaction.description}
              </Text>
              <Text
                style={[
                  styles.transactionCategory,
                  { color: colors.textSecondary },
                ]}
              >
                {transaction.category}
              </Text>
            </View>
            <View style={styles.transactionRight}>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color:
                      transaction.type === "income"
                        ? colors.income
                        : colors.expense,
                  },
                ]}
              >
                {transaction.type === "income" ? "+" : "-"}$
                {transaction.amount.toFixed(2)}
              </Text>
              <TouchableOpacity
                onPress={() => deleteTransaction(transaction.id)}
              >
                <Text style={styles.deleteButton}>刪除</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
    justifyContent: "space-between",
    marginBottom: 20,
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  summary: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  form: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  addButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionCategory: {
    fontSize: 14,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  deleteButton: {
    color: "#f44336",
  },
});
