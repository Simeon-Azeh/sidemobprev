import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

const PerformanceGraph = () => {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState({ labels: [], scores: [] });
  const [lastUpdated, setLastUpdated] = useState('');
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true);
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error('No user is logged in');
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'quizResults'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach(doc => {
          const docData = doc.data();
          data.push({
            date: docData.timestamp.toDate(),
            score: docData.score,
          });
        });

        // Sort data by date
        data.sort((a, b) => a.date - b.date);

        // Extract labels and highest scores
        const labels = data.map(item => item.date.toLocaleDateString('default', { month: 'short', day: 'numeric' }));
        const scores = data.map(item => item.score);

        setPerformanceData({ labels, scores });
        setLastUpdated(new Date().toLocaleString());
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
        <ActivityIndicator size="large" color="#9835ff" />
      </View>
    );
  }

  if (performanceData.labels.length === 0) {
    return (
      <View style={[styles.containerSub, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY }]}>
        <FontAwesome5 name="sad-tear" size={42} color={Colors.SECONDARY} style={styles.icon} />
        <Text style={[styles.title, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>No data available yet!</Text>
        <Text style={[styles.subtitle, { color: colorScheme === 'light' ? '#888' : '#ccc' }]}>You probably have not taken any quizzes yet. If you feel this was a mistake, please contact us.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('QuizChoice')}>
          <Text style={styles.buttonText}>Explore Quizzes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const data = {
    labels: performanceData.labels,
    datasets: [
      {
        data: performanceData.scores,
        color: (opacity = 1) => colorScheme === 'light' ? `rgba(152, 53, 255, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
      },
    ],
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
      <Text style={[styles.title, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Recent Performance</Text>
      <Text style={[styles.subtitle, { color: colorScheme === 'light' ? '#888' : '#ccc' }]}>Last updated: {lastUpdated}</Text>
      <LineChart
        data={data}
        width={width - 40}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY,
          backgroundGradientFrom: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY,
          backgroundGradientTo: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY,
          decimalPlaces: 2,
          color: (opacity = 1) => colorScheme === 'light' ? `rgba(152, 53, 255, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => colorScheme === 'light' ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
            padding: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: colorScheme === 'light' ? '#9835ff' : '#fff',
          },
        }}
        bezier
        style={styles.chart}
      />
      <Text style={[styles.subtitle, { color: colorScheme === 'light' ? '#888' : '#ccc' }]}>Performance Over Time</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 20,
  },
  containerSub: {
    marginVertical: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.045,
    fontFamily: 'Poppins-Medium',
  },
  subtitle: {
    fontSize: width * 0.03,
    marginBottom: 20,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginTop: 15,
  },
  chart: {
    borderRadius: 16,
  },
  icon: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    textAlign: 'center',
  },
});

export default PerformanceGraph;