import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useExpenses } from '@/context/ExpenseContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { expenses } = useExpenses();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Expense Tracker</ThemedText>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({ pathname: '/add-expense', params: { expense: JSON.stringify(item) } })}>
            <ThemedView style={styles.expenseItem}>
              <ThemedText style={styles.expenseDescription}>{item.description}</ThemedText>
              <ThemedText style={styles.expenseAmount}>${item.amount.toFixed(2)}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-expense')}>
        <ThemedText style={styles.addButtonText}>+</ThemedText>
      </TouchableOpacity>
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
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.dark.icon, // Using icon color as a subtle background
  },
  expenseDescription: {
    fontSize: 16,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dark.tint,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: Colors.dark.background,
    fontSize: 30,
    lineHeight: 32,
  },
});
