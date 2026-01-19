import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TaskContext = createContext();

// Default time estimates based on task keywords
const DEFAULT_TIME_ESTIMATES = {
  'clean': 15,
  'vacuum': 30,
  'fold': 5,
  'wash': 10,
  'cook': 30,
  'exercise': 20,
  'read': 30,
  'write': 20,
  'call': 10,
  'email': 5,
  'pack': 120,
  'wipe': 5,
  'organize': 20,
  'pick up': 5,
};

export const TaskProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const listsData = await AsyncStorage.getItem('lists');
      if (listsData) {
        setLists(JSON.parse(listsData));
      }
    } catch (error) {
      console.error('Error loading lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLists = async (updatedLists) => {
    try {
      await AsyncStorage.setItem('lists', JSON.stringify(updatedLists));
      setLists(updatedLists);
    } catch (error) {
      console.error('Error saving lists:', error);
    }
  };

  const estimateTime = (taskName) => {
    const lowerName = taskName.toLowerCase();
    for (const [keyword, time] of Object.entries(DEFAULT_TIME_ESTIMATES)) {
      if (lowerName.includes(keyword)) {
        return time;
      }
    }
    return 15; // Default 15 minutes
  };

  const createList = async (listName, color = '#B8B8D1') => {
    const newList = {
      id: Date.now().toString(),
      name: listName,
      color,
      tasks: [],
      createdAt: new Date().toISOString(),
    };
    const updatedLists = [...lists, newList];
    await saveLists(updatedLists);
    return newList;
  };

  const updateList = async (listId, updates) => {
    const updatedLists = lists.map(list =>
      list.id === listId ? { ...list, ...updates } : list
    );
    await saveLists(updatedLists);
  };

  const deleteList = async (listId) => {
    const updatedLists = lists.filter(list => list.id !== listId);
    await saveLists(updatedLists);
  };

  const addTask = async (listId, taskName, timeMinutes = null) => {
    const estimatedTime = timeMinutes || estimateTime(taskName);
    const newTask = {
      id: Date.now().toString(),
      name: taskName,
      timeMinutes: estimatedTime,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: [...list.tasks, newTask],
        };
      }
      return list;
    });

    await saveLists(updatedLists);
    return newTask;
  };

  const updateTask = async (listId, taskId, updates) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: list.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        };
      }
      return list;
    });
    await saveLists(updatedLists);
  };

  const deleteTask = async (listId, taskId) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: list.tasks.filter(task => task.id !== taskId),
        };
      }
      return list;
    });
    await saveLists(updatedLists);
  };

  const calculateSmartBreaks = (tasks) => {
    // Science-based: 5 min break after 25 min (Pomodoro), 15 min break after 90 min
    const breaks = [];
    let totalTime = 0;
    let timeSinceLastBreak = 0;

    tasks.forEach((task, index) => {
      totalTime += task.timeMinutes;
      timeSinceLastBreak += task.timeMinutes;

      // Add 5 min break every 25-30 minutes
      if (timeSinceLastBreak >= 25 && index < tasks.length - 1) {
        breaks.push({
          afterTaskIndex: index,
          duration: 5,
          type: 'short',
        });
        timeSinceLastBreak = 0;
      }

      // Add 15 min break every 90 minutes
      if (totalTime >= 90 && totalTime % 90 < tasks[index].timeMinutes) {
        breaks.push({
          afterTaskIndex: index,
          duration: 15,
          type: 'long',
        });
      }
    });

    return breaks;
  };

  return (
    <TaskContext.Provider
      value={{
        lists,
        loading,
        createList,
        updateList,
        deleteList,
        addTask,
        updateTask,
        deleteTask,
        estimateTime,
        calculateSmartBreaks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
