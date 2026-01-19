import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';

export default function ListsScreen({ navigation }) {
  const { lists } = useContext(TaskContext);
  const { signOut } = useContext(AuthContext);
  const [showArchived, setShowArchived] = useState(false);

  const activeLists = lists.filter(list => !list.archived);
  const archivedLists = lists.filter(list => list.archived);

  const handleListPress = (list) => {
    navigation.navigate('TaskListDetail', { listId: list.id });
  };

  const handleCreateList = () => {
    navigation.navigate('CreateList');
  };

  const renderListCard = ({ item, index }) => {
    const colors = ['#B8B8D1', '#F4D78C', '#A8D4A8'];
    const color = item.color || colors[index % colors.length];

    return (
      <TouchableOpacity
        style={[styles.listCard, { backgroundColor: color }]}
        onPress={() => handleListPress(item)}
      >
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{item.name}</Text>
          <Text style={styles.listMenu}>⋮</Text>
        </View>
        <View style={styles.taskPreview}>
          {item.tasks.slice(0, 3).map((task, idx) => (
            <View
              key={task.id}
              style={[
                styles.taskPreviewItem,
                task.completed && styles.taskCompleted,
              ]}
            >
              <Text
                style={[
                  styles.taskPreviewText,
                  task.completed && styles.taskCompletedText,
                ]}
              >
                {task.name}
              </Text>
            </View>
          ))}
        </View>
        {item.tasks.length > 0 && (
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigation.navigate('TaskRunner', { listId: item.id })}
          >
            <Text style={styles.playIcon}>▶</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.icon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={signOut}>
            <Text style={styles.icon}>⚙️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>LISTS</Text>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>YOU</Text>
          <Text style={styles.mainSubtitle}>GET STUFF</Text>
          <Text style={styles.mainTitleBold}>DONE</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, !showArchived && styles.tabActive]}
          onPress={() => setShowArchived(false)}
        >
          <Text style={[styles.tabText, !showArchived && styles.tabTextActive]}>
            Archived Lists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, showArchived && styles.tabActive]}
          onPress={() => setShowArchived(true)}
        >
          <Text style={[styles.tabText, showArchived && styles.tabTextActive]}>
            Lists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateList}>
          <Text style={styles.createButtonText}>+ Create New List</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer}>
        {(showArchived ? archivedLists : activeLists).map((item, index) => (
          <View key={item.id} style={styles.cardWrapper}>
            {renderListCard({ item, index }).props.children}
          </View>
        ))}
        {(showArchived ? archivedLists : activeLists).length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {showArchived ? 'No archived lists' : 'Create your first list to get started!'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B4D4E1',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    letterSpacing: 2,
  },
  titleSection: {
    alignItems: 'flex-start',
    marginTop: 20,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: '300',
  },
  mainSubtitle: {
    fontSize: 42,
    fontWeight: '300',
  },
  mainTitleBold: {
    fontSize: 42,
    fontWeight: '800',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#000',
  },
  tabText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  listCard: {
    borderRadius: 25,
    padding: 25,
    minHeight: 250,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
  },
  listMenu: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  taskPreview: {
    flex: 1,
  },
  taskPreviewItem: {
    backgroundColor: '#A8D4A8',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  taskCompleted: {
    opacity: 0.5,
  },
  taskPreviewText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  taskCompletedText: {
    textDecorationLine: 'line-through',
  },
  playButton: {
    alignSelf: 'center',
    marginTop: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  playIcon: {
    fontSize: 24,
    color: '#000',
    marginLeft: 4,
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
});
