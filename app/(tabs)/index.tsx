import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useExpenses } from '@/context/ExpenseContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { expenses, sortOrder, setSortOrder, filterRange, setFilterRange } = useExpenses();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Expense Tracker</ThemedText>
      <View style={styles.controlsContainer}>
        <View style={styles.sortContainer}>
          <TouchableOpacity onPress={() => setSortOrder('date')} style={[styles.sortButton, sortOrder === 'date' && styles.activeSortButton]}>
            <ThemedText>Sort by Date</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortOrder('amount')} style={[styles.sortButton, sortOrder === 'amount' && styles.activeSortButton]}>
            <ThemedText>Sort by Amount</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.filterContainer}>
          <TextInput
            style={styles.input}
            placeholder="Min Amount"
            keyboardType="numeric"
            onChangeText={min => setFilterRange({ ...filterRange, min: parseFloat(min) || 0 })}
          />
          <TextInput
            style={styles.input}
            placeholder="Max Amount"
            keyboardType="numeric"
            onChangeText={max => setFilterRange({ ...filterRange, max: parseFloat(max) || Infinity })}
          />
        </View>
      </View>
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
  controlsContainer: {
    marginBottom: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  sortButton: {
    padding: 8,
    borderRadius: 8,
  },
  activeSortButton: {
    backgroundColor: Colors.dark.tint,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    borderColor: Colors.dark.icon,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: Colors.dark.text,
    flex: 1,
    marginHorizontal: 4,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.dark.icon,
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
    elevation: 8,
    shadowColor: '#000',
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

