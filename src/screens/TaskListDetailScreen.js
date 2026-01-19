import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import { TaskContext } from '../context/TaskContext';

export default function TaskListDetailScreen({ navigation, route }) {
  const { listId } = route.params;
  const { lists, addTask, updateTask, deleteTask } = useContext(TaskContext);
  const [newTaskName, setNewTaskName] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const list = lists.find((l) => l.id === listId);

  if (!list) {
    return (
      <View style={styles.container}>
        <Text>List not found</Text>
      </View>
    );
  }

  const handleAddTask = async () => {
    if (!newTaskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    const timeMinutes = customTime ? parseInt(customTime) : null;
    await addTask(listId, newTaskName, timeMinutes);
    setNewTaskName('');
    setCustomTime('');
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTask(listId, taskId),
      },
    ]);
  };

  const handleEditTask = async (taskId, updates) => {
    await updateTask(listId, taskId, updates);
    setEditingTask(null);
  };

  const formatTime = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours} hrs ${mins} mins` : `${hours} hrs`;
    }
    return `${minutes} mins`;
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskContent}>
        <Text style={styles.taskName}>{item.name}</Text>
        <TouchableOpacity
          style={styles.timeChip}
          onPress={() => setEditingTask(item)}
        >
          <Text style={styles.timeText}>{formatTime(item.timeMinutes)}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(item.id)}
      >
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: list.color }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{list.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={list.tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks yet. Add one below!</Text>
          </View>
        }
      />

      <View style={styles.addTaskSection}>
        <Text style={styles.addTaskLabel}>add task</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.taskInput}
            placeholder="Task name"
            value={newTaskName}
            onChangeText={setNewTaskName}
          />
          <TextInput
            style={styles.timeInput}
            placeholder="mins"
            value={customTime}
            onChangeText={setCustomTime}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {list.tasks.length > 0 && (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('TaskRunner', { listId: list.id })}
        >
          <Text style={styles.startButtonText}>start tasks</Text>
          <View style={styles.playButtonLarge}>
            <Text style={styles.playIconLarge}>▶</Text>
          </View>
        </TouchableOpacity>
      )}

      <Modal
        visible={editingTask !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingTask(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task Time</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Time in minutes"
              keyboardType="number-pad"
              defaultValue={editingTask?.timeMinutes.toString()}
              onChangeText={(text) => {
                if (editingTask) {
                  handleEditTask(editingTask.id, {
                    timeMinutes: parseInt(text) || 15,
                  });
                }
              }}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setEditingTask(null)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 32,
    color: '#000',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#A8D4A8',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskName: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  timeChip: {
    backgroundColor: '#A8D4A8',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#000',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
  deleteIcon: {
    fontSize: 20,
    color: '#000',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  addTaskSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  addTaskLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  taskInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  timeInput: {
    width: 80,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  addIcon: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '300',
  },
  startButton: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  playButtonLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#000',
  },
  playIconLarge: {
    fontSize: 32,
    color: '#000',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
