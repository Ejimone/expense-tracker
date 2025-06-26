import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useExpenses } from '@/context/ExpenseContext';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AddExpenseScreen() {
  const { expense } = useLocalSearchParams();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const { addExpense, updateExpense, deleteExpense } = useExpenses();
  const router = useRouter();
  const isEditing = !!expense;

  useEffect(() => {
    if (isEditing) {
      const parsedExpense = JSON.parse(expense as string);
      setDescription(parsedExpense.description);
      setAmount(parsedExpense.amount.toString());
    }
  }, [expense]);

  const onSave = () => {
    if (description && amount) {
      if (isEditing) {
        const parsedExpense = JSON.parse(expense as string);
        updateExpense({ ...parsedExpense, description, amount: parseFloat(amount) });
      } else {
        addExpense({ description, amount: parseFloat(amount) });
      }
      router.back();
    }
  };

  const onDelete = () => {
    if (isEditing) {
      const parsedExpense = JSON.parse(expense as string);
      deleteExpense(parsedExpense.id);
      router.back();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>{isEditing ? 'Edit Expense' : 'Add Expense'}</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <ThemedText style={styles.saveButtonText}>Save</ThemedText>
      </TouchableOpacity>
      {isEditing && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: Colors.dark.icon,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: Colors.dark.text,
  },
  saveButton: {
    backgroundColor: Colors.dark.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 16,
    backgroundColor: Colors.dark.icon,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
});
