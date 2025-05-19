import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Texts } from "../constants/Texts";
import { useTheme } from "./context/ThemeContext";

interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  date: string;
  created_at: string;
  updated_at: string;
}

const TransactionItem = ({
  transaction,
  onDelete,
  colors,
  isOpen,
  onSwipeableOpen,
}: {
  transaction: Transaction;
  onDelete: (id: number) => void;
  colors: any;
  isOpen: boolean;
  onSwipeableOpen: (id: number) => void;
}) => {
  const swipeableRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen && swipeableRef.current) {
      swipeableRef.current.close();
    }
  }, [isOpen]);

  const renderRightActions = () => {
    return (
      <Animated.View style={styles.deleteAction}>
        <TouchableOpacity
          style={styles.deleteActionContent}
          onPress={() => onDelete(transaction.id)}
        >
          <Text style={styles.deleteActionText}>刪除</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
      friction={2}
      enableTrackpadTwoFingerGesture
      onSwipeableOpen={() => onSwipeableOpen(transaction.id)}
    >
      <Animated.View
        style={[
          styles.transactionItem,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.transactionLeft}>
          <View style={styles.transactionHeader}>
            <Text
              style={[styles.transactionDescription, { color: colors.text }]}
            >
              {transaction.description}
            </Text>
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
          </View>
          <View style={styles.transactionDetails}>
            <Text
              style={[
                styles.transactionCategory,
                { color: colors.textSecondary },
              ]}
            >
              {transaction.category}
            </Text>
            <Text
              style={[styles.transactionDate, { color: colors.textSecondary }]}
            >
              {new Date(transaction.date).toLocaleDateString("zh-TW")}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Swipeable>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [openTransactionId, setOpenTransactionId] = useState<number | null>(
    null
  );
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

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

    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      id: Date.now(),
      date: date.toISOString(),
      type,
      category,
      amount: parseFloat(amount),
      description,
      created_at: now,
      updated_at: now,
    };

    try {
      await saveTransactions([...transactions, newTransaction]);
      setAmount("");
      setDescription("");
      setCategory("");
      setDate(new Date());
    } catch (error) {
      Alert.alert("錯誤", "無法新增交易記錄");
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      const updatedTransactions = transactions.filter((t) => t.id !== id);
      await saveTransactions(updatedTransactions);
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

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleConfirmDate = () => {
    setDate(tempDate);
    setShowDatePicker(false);
  };

  const handleCancelDate = () => {
    setTempDate(date);
    setShowDatePicker(false);
  };

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
        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            setTempDate(date);
            setShowDatePicker(true);
          }}
        >
          <Text style={{ color: colors.text }}>
            日期: {date.toLocaleDateString("zh-TW")}
          </Text>
        </TouchableOpacity>
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View
              style={[styles.modalContent, { backgroundColor: colors.card }]}
            >
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={styles.datePicker}
                textColor={colors.text}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.button },
                  ]}
                  onPress={handleConfirmDate}
                >
                  <Text style={styles.modalButtonText}>確認</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.border },
                  ]}
                  onPress={handleCancelDate}
                >
                  <Text style={styles.modalButtonText}>取消</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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

      <ScrollView
        style={[styles.transactionList, { backgroundColor: colors.background }]}
      >
        <View style={styles.transactionListHeader}>
          <Text
            style={[styles.transactionListHeaderText, { color: colors.text }]}
          >
            交易記錄
          </Text>
        </View>
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onDelete={deleteTransaction}
            colors={colors}
            isOpen={openTransactionId === transaction.id}
            onSwipeableOpen={(id) => setOpenTransactionId(id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  menuButton: {
    padding: 15,
  },
  menuButtonText: {
    fontSize: 24,
  },
  title: {
    padding: 15,
    fontSize: 24,
    fontWeight: "bold",
  },
  summary: {
    padding: 15,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  form: {
    padding: 15,
    marginBottom: 10,
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
  transactionListHeader: {
    padding: 15,
    marginBottom: 10,
  },
  transactionListHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionItem: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  transactionLeft: {
    flex: 1,
    marginRight: 10,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  transactionCategory: {
    fontSize: 14,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#ffebee",
  },
  deleteButtonText: {
    color: "#f44336",
    fontSize: 14,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  datePicker: {
    width: "100%",
    height: 200,
    color: "#000000",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteAction: {
    width: 80,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffebee",
  },
  deleteActionContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteActionText: {
    color: "#f44336",
    fontSize: 16,
    fontWeight: "bold",
  },
});
