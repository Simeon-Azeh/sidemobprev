import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';
import Colors from '../../../assets/Utils/Colors';
import { auth, firestore } from '../../../firebaseConfig';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import BarChartSkeleton from '../BarchartSkeleton';
import { useColorScheme } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const BarChartComponent = () => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('week');
  const [studyData, setStudyData] = useState({
    week: [0, 0, 0, 0, 0, 0, 0],
    month: [0, 0, 0, 0],
    sixMonths: [0, 0, 0, 0, 0, 0],
  });
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const unsubscribe = onSnapshot(collection(firestore, 'courseProgress', user.uid, 'courses'), (snapshot) => {
        if (!snapshot.empty) {
          const newStudyData = {
            week: [0, 0, 0, 0, 0, 0, 0],
            month: [0, 0, 0, 0],
            sixMonths: [0, 0, 0, 0, 0, 0],
          };

          snapshot.forEach((doc) => {
            const course = doc.data();
            const progress = course.progress / 100;
            const totalDuration = course.totalDuration; // in minutes
            const timeSpent = totalDuration * progress;

            const dayIndex = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
            newStudyData.week[dayIndex] += timeSpent;

            const weekIndex = Math.floor(dayIndex / 7);
            newStudyData.month[weekIndex] += timeSpent;

            const monthIndex = new Date().getMonth() % 6;
            newStudyData.sixMonths[monthIndex] += timeSpent;
          });

          setStudyData(newStudyData);
        } else {
          setStudyData({
            week: [0, 0, 0, 0, 0, 0, 0],
            month: [0, 0, 0, 0],
            sixMonths: [0, 0, 0, 0, 0, 0],
          });
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  const data = {
    week: {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [{ data: studyData.week }],
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{ data: studyData.month }],
    },
    sixMonths: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ data: studyData.sixMonths }],
    },
  };

  const chartConfig = {
    backgroundGradientFrom: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_BACKGROUND,
    backgroundGradientTo: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_BACKGROUND,
    color: (opacity = 1) => colorScheme === 'light' ? `rgba(152, 53, 255, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
    barPercentage: 0.5,
    borderRadius: 16,
    labelColor: (opacity = 1) => colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE,
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={[styles.headerText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>
        Study Hours
      </Text>
      {loading ? (
        <BarChartSkeleton />
      ) : (
        <>
          <RNPickerSelect
            onValueChange={(value) => setSelectedTimePeriod(value)}
            items={[
              { label: 'This Week', value: 'week' },
              { label: 'This Month', value: 'month' },
              { label: 'Last 6 Months', value: 'sixMonths' },
            ]}
            style={{
              ...pickerStyles,
              inputAndroid: {
                ...pickerStyles.inputAndroid,
                color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE,
                backgroundColor: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_SECONDARY,
              },
              inputIOS: {
                ...pickerStyles.inputIOS,
                color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE,
                backgroundColor: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_SECONDARY,
              },
            }}
            value={selectedTimePeriod} // Set the default value
          />
          <BarChart
            data={{
              labels: data[selectedTimePeriod].labels,
              datasets: data[selectedTimePeriod].datasets,
            }}
            width={screenWidth - 40}
            height={240}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            showValuesOnTopOfBars
            fromZero
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: screenWidth * 0.045,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
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

export default BarChartComponent;