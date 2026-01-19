import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  Vibration,
} from 'react-native';
import { Audio } from 'expo-av';
import { TaskContext } from '../context/TaskContext';

export default function TaskRunnerScreen({ navigation, route }) {
  const { listId } = route.params;
  const { lists, updateTask, calculateSmartBreaks } = useContext(TaskContext);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [breakMode, setBreakMode] = useState('smart'); // 'smart', 'custom', 'none'
  const [showBreakSettings, setShowBreakSettings] = useState(false);
  const [smartBreaks, setSmartBreaks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const timerRef = useRef(null);
  const soundRef = useRef(null);

  const list = lists.find((l) => l.id === listId);

  useEffect(() => {
    if (list && list.tasks.length > 0) {
      const breaks = calculateSmartBreaks(list.tasks);
      setSmartBreaks(breaks);
      setTimeRemaining(list.tasks[0].timeMinutes * 60);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTaskComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        // Using a simple beep sound (you can replace with custom sound file)
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      Vibration.vibrate([0, 500, 200, 500]);
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handleTaskComplete = async () => {
    setIsRunning(false);
    playSound();

    if (!list || !list.tasks[currentTaskIndex]) return;

    // Mark task as completed
    const task = list.tasks[currentTaskIndex];
    await updateTask(listId, task.id, { completed: true });
    setCompletedTasks([...completedTasks, task.id]);

    // Check if there's a break after this task
    const breakAfterTask = smartBreaks.find(
      (b) => b.afterTaskIndex === currentTaskIndex
    );

    if (breakMode === 'smart' && breakAfterTask) {
      // Start break
      setIsBreak(true);
      setTimeRemaining(breakAfterTask.duration * 60);

      Alert.alert(
        '🎉 Task Complete!',
        `Great job! Take a ${breakAfterTask.duration} minute ${
          breakAfterTask.type === 'long' ? 'long' : 'short'
        } break.`,
        [
          {
            text: 'Skip Break',
            onPress: () => moveToNextTask(),
          },
          {
            text: 'Start Break',
            onPress: () => setIsRunning(true),
          },
        ]
      );
    } else {
      moveToNextTask();
    }
  };

  const moveToNextTask = () => {
    setIsBreak(false);

    if (currentTaskIndex < list.tasks.length - 1) {
      const nextIndex = currentTaskIndex + 1;
      setCurrentTaskIndex(nextIndex);
      setTimeRemaining(list.tasks[nextIndex].timeMinutes * 60);

      Alert.alert(
        'Next Task',
        `Ready for: ${list.tasks[nextIndex].name}`,
        [
          {
            text: 'Start',
            onPress: () => setIsRunning(true),
          },
        ]
      );
    } else {
      // All tasks complete
      Alert.alert(
        '🎊 All Tasks Complete!',
        'Congratulations! You finished all your tasks!',
        [
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleSkipTask = () => {
    Alert.alert(
      'Skip Task',
      'Are you sure you want to skip this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            setIsRunning(false);
            moveToNextTask();
          },
        },
      ]
    );
  };

  const renderTaskCard = (task, index) => {
    const isCurrentTask = index === currentTaskIndex;
    const isCompleted = completedTasks.includes(task.id);
    const isPending = index > currentTaskIndex;

    let backgroundColor = '#A8D4A8'; // Default green
    if (isCompleted) {
      backgroundColor = '#F4D78C'; // Yellow for completed
    } else if (isCurrentTask) {
      backgroundColor = '#A8D4A8'; // Green for current
    } else if (isPending) {
      backgroundColor = '#D0E8D8'; // Light green for pending
    }

    return (
      <View
        key={task.id}
        style={[
          styles.taskCard,
          { backgroundColor },
          isCurrentTask && styles.currentTaskCard,
          isCompleted && styles.completedTaskCard,
        ]}
      >
        <Text
          style={[
            styles.taskCardText,
            isCompleted && styles.taskCardTextCompleted,
          ]}
        >
          {task.name}
        </Text>
        {isCompleted && <Text style={styles.completedLabel}>completed</Text>}
      </View>
    );
  };

  if (!list || list.tasks.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No tasks to run</Text>
      </View>
    );
  }

  const currentTask = isBreak ? null : list.tasks[currentTaskIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{list.name}</Text>
        <TouchableOpacity onPress={() => setShowBreakSettings(true)}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timerSection}>
        <Text style={styles.timerLabel}>
          {isBreak ? 'BREAK TIME' : 'COUNT DOWN'}
        </Text>
        <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
      </View>

      <ScrollView style={styles.taskList} contentContainerStyle={styles.taskListContent}>
        {list.tasks.map((task, index) => renderTaskCard(task, index))}
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handlePlayPause}
        >
          <Text style={styles.controlButtonText}>
            {isRunning ? '⏸️ Pause' : '▶️ Play'}
          </Text>
        </TouchableOpacity>
        {!isBreak && (
          <TouchableOpacity
            style={[styles.controlButton, styles.skipButton]}
            onPress={handleSkipTask}
          >
            <Text style={styles.controlButtonText}>Skip ⏭️</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showBreakSettings}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBreakSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Break Settings</Text>

            <TouchableOpacity
              style={[
                styles.breakOption,
                breakMode === 'smart' && styles.breakOptionActive,
              ]}
              onPress={() => setBreakMode('smart')}
            >
              <Text style={styles.breakOptionText}>
                🧠 Smart Breaks (Recommended)
              </Text>
              <Text style={styles.breakOptionDesc}>
                5 min breaks every 25 min, 15 min breaks every 90 min
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.breakOption,
                breakMode === 'none' && styles.breakOptionActive,
              ]}
              onPress={() => setBreakMode('none')}
            >
              <Text style={styles.breakOptionText}>⚡ No Breaks</Text>
              <Text style={styles.breakOptionDesc}>
                Power through all tasks without breaks
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowBreakSettings(false)}
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
    backgroundColor: '#B8B8D1',
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
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  settingsIcon: {
    fontSize: 24,
  },
  timerSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#A8D4A8',
    marginHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 2,
    color: '#000',
  },
  timer: {
    fontSize: 48,
    fontWeight: '800',
    color: '#000',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskListContent: {
    gap: 16,
    paddingBottom: 20,
  },
  taskCard: {
    borderRadius: 25,
    padding: 24,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentTaskCard: {
    borderWidth: 4,
    borderColor: '#000',
  },
  completedTaskCard: {
    opacity: 0.7,
  },
  taskCardText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
  },
  taskCardTextCompleted: {
    textDecorationLine: 'line-through',
  },
  completedLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: '#666',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  breakOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  breakOptionActive: {
    borderColor: '#000',
    backgroundColor: '#f0f0f0',
  },
  breakOptionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  breakOptionDesc: {
    fontSize: 12,
    color: '#666',
  },
  modalButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
