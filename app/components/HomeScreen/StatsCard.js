import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';

const { width: screenWidth } = Dimensions.get('window');

export default function StatsCard() {
  const navigation = useNavigation();
  const [savedCoursesCount, setSavedCoursesCount] = useState(0);
  const [certificatesCount, setCertificatesCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();

          // Fetch saved courses count
          const savedCoursesQuery = query(collection(db, 'savedCourses'), where('email', '==', user.email));
          const savedCoursesSnapshot = await getDocs(savedCoursesQuery);
          setSavedCoursesCount(savedCoursesSnapshot.size);

          // Fetch certificates count
          const certificatesQuery = query(collection(db, 'certificates'), where('email', '==', user.email));
          const certificatesSnapshot = await getDocs(certificatesQuery);
          setCertificatesCount(certificatesSnapshot.size);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Saved Courses',
      count: savedCoursesCount,
      icon: 'bookmark',
      screen: 'SavedCourses'
    },
    {
      title: 'Certificates',
      count: certificatesCount,
      icon: 'star',
      screen: 'Certificates'
    }
  ];

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, gap: screenWidth * 0.03 }}>
      {stats.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: Colors.PRIMARY,
            padding: 15,
            alignItems: 'center',
            width: screenWidth * 0.45,
          }}
          onPress={() => navigation.navigate(item.screen)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Feather name={item.icon} size={25} color={Colors.PRIMARY} />
            <Text style={{ fontSize: screenWidth * 0.04, color: Colors.SECONDARY, fontFamily: 'Poppins-Medium', marginTop: 5 }}>
              {item.count}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Text style={{ fontSize: screenWidth * 0.035, fontFamily: 'Poppins-Medium', marginVertical: 5, color: Colors.PRIMARY }}>
              {item.title}
            </Text>
            <MaterialIcons name="chevron-right" size={25} color={Colors.PRIMARY} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}