import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import { format } from 'date-fns';
import { auth } from '../../../firebaseConfig';
import { useColorScheme } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const TaskListComponent = ({ tasks, addTask, deleteTask, completeTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date());
  const [newTaskIcon, setNewTaskIcon] = useState('assignment');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showAllUpcomingTasks, setShowAllUpcomingTasks] = useState(false);
  const colorScheme = useColorScheme();

  const themeBackgroundColor = colorScheme === 'light' ? Colors.WHITE : Colors.DARK_BACKGROUND;
  const themeTextColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT;
  const themeButtonBackgroundColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON;
  const themeButtonTextColor = Colors.WHITE;
  const themeInputBackgroundColor = colorScheme === 'light' ? Colors.WHITE : Colors.DARK_SECONDARY;
  const themeInputTextColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT;
  const themeCompletedTaskBackgroundColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_SECONDARY;
  const themeOngoingTaskBorderColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT;
  const themeMissedTaskBackgroundColor = colorScheme === 'light' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 0, 0, 0.2)';
  const themeIconColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE;

  const handleAddTask = async () => {
    if (newTaskTitle && newTaskDueDate) {
      setLoading(true);
      const newTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: newTaskDescription,
        dueDate: newTaskDueDate.toISOString(),
        icon: newTaskIcon,
        email: auth.currentUser.email,
        completed: false,
      };
      await addTask(newTask);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate(new Date());
      setNewTaskIcon('assignment');
      setLoading(false);
    }
  };

  const handleConfirmDate = (date) => {
    setShowDatePicker(false);
    setNewTaskDueDate(date);
    setShowTimePicker(true);
  };

  const handleConfirmTime = (time) => {
    setShowTimePicker(false);
    const updatedDate = new Date(newTaskDueDate);
    updatedDate.setHours(time.getHours());
    updatedDate.setMinutes(time.getMinutes());
    setNewTaskDueDate(updatedDate);
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteTask(taskId)
        }
      ]
    );
  };

  const handleCompleteTask = (taskId) => {
    completeTask(taskId);
  };

  const getStatus = (dueDate, completed) => {
    const now = new Date();
    const due = new Date(dueDate);
    if (completed) {
      return 'Completed';
    } else if (due < now) {
      return 'Missed';
    } else {
      return 'Ongoing';
    }
  };

  const filteredTasks = showAllTasks ? tasks : tasks.filter(task => getStatus(task.dueDate, task.completed) === 'Ongoing');
  const displayedTasks = showAllUpcomingTasks ? filteredTasks : filteredTasks.slice(0, 4);

  return (
    <ScrollView style={{ padding: 20, backgroundColor: themeBackgroundColor }}>
      <Text style={[styles.headerText, { color: themeTextColor }]}>Upcoming Tasks</Text>
      {displayedTasks.length === 0 ? (
        <View style={styles.noTasksContainer}>
          <MaterialIcons name="event-note" size={50} color="#bbb" />
          <Text style={[styles.noTasksTitle, { color: themeTextColor }]}>Hurray!!!, No task today!🎊</Text>
          <Text style={styles.noTasksMessage}>
            Stay organized and productive. Create your first task now to get started on your journey to success!
          </Text>
        </View>
      ) : (
        <View>
          {displayedTasks.map((task, index) => (
            <View key={task.id} style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <TouchableOpacity
                style={[
                  styles.taskItem,
                  task.completed && { backgroundColor: themeCompletedTaskBackgroundColor },
                  !task.completed && getStatus(task.dueDate, task.completed) === 'Missed' && { backgroundColor: themeMissedTaskBackgroundColor },
                  !task.completed && getStatus(task.dueDate, task.completed) === 'Ongoing' && { borderColor: themeOngoingTaskBorderColor, borderWidth: 1 },
                ]}
                onPress={() => handleCompleteTask(task.id)}
                onLongPress={() => handleDeleteTask(task.id)}
              >
                <MaterialIcons name={task.icon} size={24} color={task.completed ? Colors.WHITE : themeIconColor} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={[styles.taskTitle, task.completed && styles.completedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Missed' && styles.missedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Ongoing' && { color: themeTextColor }]}>{task.title}</Text>
                  <Text style={[styles.taskDescription, task.completed && styles.completedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Missed' && styles.missedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Ongoing' && { color: themeTextColor }]}>{task.description}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.taskDate, task.completed && styles.completedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Missed' && styles.missedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Ongoing' && { color: themeTextColor }]}>{format(new Date(task.dueDate), 'MMMM d, h:mma')}</Text>
                  <Text style={[styles.taskStatus, task.completed && styles.completedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Missed' && styles.missedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Ongoing' && { color: themeTextColor }]}>{getStatus(task.dueDate, task.completed)}   {task.completed && <MaterialIcons name="check-circle" size={14} color="white" />}</Text>
                </View>
              </TouchableOpacity>
              {index % 2 === 1 && <View style={{ width: '100%', height: 10 }} />} 
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity onPress={() => setShowAllUpcomingTasks(!showAllUpcomingTasks)} style={[styles.showAllButton, { backgroundColor: themeButtonBackgroundColor }]}>
        <Text style={[styles.showAllButtonText, { color: themeButtonTextColor }]}>{showAllUpcomingTasks ? 'Show Less' : 'Show All Upcoming Tasks'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowAllTasks(!showAllTasks)} style={[styles.showAllButton, { backgroundColor: themeButtonBackgroundColor }]}>
        <Text style={[styles.showAllButtonText, { color: themeButtonTextColor }]}>{showAllTasks ? 'Show Ongoing Tasks' : 'Show All Tasks'}</Text>
      </TouchableOpacity>
      <View style={styles.addTaskContainer}>
        <TextInput
          placeholder="Task Title"
          placeholderTextColor={themeInputTextColor}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          style={[styles.input, { backgroundColor: themeInputBackgroundColor, color: themeInputTextColor }]}
        />
        <TextInput
          placeholder="Task Description"
          placeholderTextColor={themeInputTextColor}
          value={newTaskDescription}
          onChangeText={setNewTaskDescription}
          style={[styles.input, { backgroundColor: themeInputBackgroundColor, color: themeInputTextColor }]}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.datePickerButton, { backgroundColor: themeInputBackgroundColor }]}>
          <Text style={[styles.datePickerText, { color: themeInputTextColor }]}>{format(newTaskDueDate, 'MMMM d, h:mma')}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setShowDatePicker(false)}
        />
        <DateTimePickerModal
          isVisible={showTimePicker}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={() => setShowTimePicker(false)}
        />
        <RNPickerSelect
          onValueChange={(value) => setNewTaskIcon(value)}
          items={[
            { label: 'Assignment', value: 'assignment' },
            { label: 'Quiz', value: 'quiz' },
            { label: 'Essay', value: 'description' },
          ]}
          style={{
            ...pickerStyles,
            inputAndroid: {
              ...pickerStyles.inputAndroid,
              color: themeInputTextColor,
              backgroundColor: themeInputBackgroundColor,
            },
            inputIOS: {
              ...pickerStyles.inputIOS,
              color: themeInputTextColor,
              backgroundColor: themeInputBackgroundColor,
            },
          }}
          placeholder={{ label: 'Select an icon...', value: null }}
          value={newTaskIcon}
        />
        <TouchableOpacity onPress={handleAddTask} style={[styles.addButton, { backgroundColor: themeButtonBackgroundColor }]} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={themeButtonTextColor} />
          ) : (
            <Text style={[styles.addButtonText, { color: themeButtonTextColor }]}>Add Task</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: screenWidth * 0.045,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  noTasksText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    height: 80,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  taskDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  taskDate: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  taskStatus: {
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  completedTaskText: {
    color: Colors.WHITE,
  },
  missedTaskText: {
    color: 'red',
  },
  sectionHeader: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    marginVertical: 10,
  },
  addTaskContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  datePickerText: {
    fontFamily: 'Poppins-Medium',
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Poppins-Medium',
  },
  showAllButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  showAllButtonText: {
    fontFamily: 'Poppins-Medium',
  },
  noTasksContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  noTasksTitle: {
    fontSize: 20,
    marginVertical: 5,
    fontFamily: 'Poppins-Medium',
  },
  noTasksMessage: {
    fontSize: 12,
    textAlign: 'center',
    color: '#777',
    marginTop: 2,
    fontFamily: 'Poppins',
  },
});

const pickerStyles = {
  inputAndroid: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    fontFamily: 'Poppins-Medium',
  },
  inputIOS: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    fontFamily: 'Poppins-Medium',
  },
};

export default TaskListComponent;