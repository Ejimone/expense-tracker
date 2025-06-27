import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useExpenses } from "@/context/ExpenseContext";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GEMINI_API_KEY = "AIzaSyCfzu-zQw5X69G4G7veVNS9_zW3Po5utxQ";

export default function AiChat() {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; text: string }[]
  >([]);
  const { addExpense, updateExpense, deleteExpense, expenses } = useExpenses();

  const handleSend = async () => {
    if (!message) return;

    const userMessage = { role: "user", text: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expense tracking assistant. You can add, update, and delete expenses. Current expenses: ${JSON.stringify(
                      expenses
                    )}. User command: "${message}". Respond with a command: create_expense('description', amount), update_expense('id', 'description', amount), or delete_expense('id').`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("Gemini API Response:", data);
      const aiResponse = data.candidates[0].content.parts[0].text;
      console.log('AI Response Text:', aiResponse);
      const assistantMessage = { role: "assistant", text: aiResponse };
      setChatHistory((prev) => [...prev, assistantMessage]);

      // Parse and execute the command
      if (aiResponse.startsWith("create_expense")) {
        const params = aiResponse.match(/\(([^)]+)\)/)[1].split(",");
        const description = params[0].replace(/['"]/g, "").trim();
        const amount = parseFloat(params[1]);
        addExpense({ description, amount });
      } else if (aiResponse.startsWith("update_expense")) {
        const params = aiResponse.match(/\(([^)]+)\)/)[1].split(",");
        const id = params[0].replace(/['"]/g, "").trim();
        const description = params[1].replace(/['"]/g, "").trim();
        const amount = parseFloat(params[2]);
        const expenseToUpdate = expenses.find((exp) => exp.id === id);
        if (expenseToUpdate) {
          updateExpense({ ...expenseToUpdate, description, amount });
        }
      } else if (aiResponse.startsWith("delete_expense")) {
        const id = aiResponse
          .match(/\(([^)]+)\)/)[1]
          .replace(/['"]/g, "")
          .trim();
        deleteExpense(id);
      }
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      const errorMessage = {
        role: "assistant",
        text: "Sorry, I had trouble understanding that.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText style={styles.fabIcon}>AI</ThemedText>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ThemedView style={styles.modalView}>
          <ThemedText type="title" style={styles.modalTitle}>AI Assistant</ThemedText>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <ThemedText style={styles.closeButtonText}>X</ThemedText>
          </TouchableOpacity>
          <FlatList
            data={chatHistory}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={
                  item.role === "user" ? styles.userMessage : styles.aiMessage
                }
              >
                <ThemedText>{item.text}</ThemedText>
              </View>
            )}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g., Add expense for coffee 5.25"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <ThemedText>Send</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    left: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dark.tint,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabIcon: {
    color: Colors.dark.background,
    fontSize: 24,
    fontWeight: "bold",
  },
  modalView: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderColor: Colors.dark.icon,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: Colors.dark.text,
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: "center",
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.dark.tint,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    color: Colors.light.text, // Changed to a contrasting color
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.dark.icon,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
});
