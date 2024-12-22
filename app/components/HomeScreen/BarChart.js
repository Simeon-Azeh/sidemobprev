import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';
import Colors from '../../../assets/Utils/Colors';

const screenWidth = Dimensions.get('window').width;

const BarChartComponent = () => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('week');

  const data = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [2, 3, 4, 2, 5, 6, 7],
        },
      ],
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          data: [10, 20, 15, 30],
        },
      ],
    },
    sixMonths: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [40, 60, 80, 20, 90, 50],
        },
      ],
    },
  };

  const chartConfig = {
    backgroundGradientFrom: '#f9feff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(152, 53, 255, ${opacity})`,
    barPercentage: 0.5,
    borderRadius: 16,

  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: screenWidth * 0.045, marginBottom: 10, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>
        Study Hours
      </Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedTimePeriod(value)}
        items={[
          { label: 'This Week', value: 'week' },
          { label: 'This Month', value: 'month' },
          { label: 'Last 6 Months', value: 'sixMonths' },
        ]}
        style={{
          inputAndroid: {
            color: Colors.SECONDARY,
            padding: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
            backgroundColor: Colors.WHITE,
            fontFamily: 'Poppins-Medium',
           
          },
          inputIOS: {
            color: 'black',
            padding: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
            fontFamily: 'Poppins-Medium',
           
          },
        }}
        placeholder={{ label: 'Select a time period...', value: null }}
      />
      <BarChart
        data={{
          labels: data[selectedTimePeriod].labels,
          datasets: data[selectedTimePeriod].datasets,
        }}
        width={screenWidth - 40} // from react-native
        height={240}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        showValuesOnTopOfBars
        fromZero
        renderDotContent={({ x, y, index, indexData }) => (
          <Text key={index} style={{ position: 'absolute', top: y - 10, left: x - 10, color: 'black' }}>
            {indexData}
          </Text>
        )}
      />
    </View>
  );
};

export default BarChartComponent;
