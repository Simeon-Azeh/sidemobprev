// components/PerformanceGraph.js

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const PerformanceGraph = () => {
  const data = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], // Labels for the last 6 months
    datasets: [
      {
        data: [75, 88, 92, 85, 90, 95], // Sample data for recent performance
        color: (opacity = 1) => `rgba(152, 53, 255, ${opacity})`, // Updated color
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Performance</Text>
      <Text style={styles.subtitle}>Last updated: Nov 26th, at 10:00 AM</Text>
      <LineChart
        data={data}
        width={width - 40}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(152, 53, 255, ${opacity})`, // Updated color
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
            padding: 16, // Add padding around the chart
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#9835ff', // Updated color for dots
          },
        }}
        style={styles.chart}
      />
       <Text style={styles.subtitle}>May 2024 - Nov 2024</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  
    marginVertical: 20,
    padding: 20, // Add padding to the container
  },
  title: {
    fontSize: width * 0.045,
    color: '#9835ff', // Title color
    fontFamily: 'Poppins-Medium',
   
  },
  subtitle: {
    fontSize: width * 0.03,
    color: '#888', // Subtitle color
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  chart: {
    borderRadius: 16,
  },
});

export default PerformanceGraph;
