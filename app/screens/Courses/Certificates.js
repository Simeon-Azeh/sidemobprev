import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

export default function Certificate() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const certificatesQuery = query(collection(db, 'certificates'), where('userId', '==', user.uid));
          const certificatesSnapshot = await getDocs(certificatesQuery);
          const certificatesData = certificatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCertificates(certificatesData);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleDownload = (certificate) => {
    console.log(`Downloading certificate: ${certificate.title}`);
    // Implement actual download functionality here
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (certificates.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome6 name="certificate" size={50} color={Colors.PRIMARY} />
        <Text style={styles.emptyText}>You have no certificates.</Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Courses')}
        >
          <Text style={styles.exploreButtonText}>Explore Courses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Your Certificates</Text>
      {certificates.map((certificate, index) => (
        <View key={index} style={styles.certificateCard}>
          <View style={styles.iconWrapper}>
            <Text style={styles.iconText}><MaterialCommunityIcons name="certificate" size={24} color="white" /></Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{certificate.title}</Text>
            <Text style={styles.issueDate}>Issued on: {certificate.issueDate}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDownload(certificate)} style={styles.downloadButton}>
            <Ionicons name="download-outline" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 20,
  },
  certificateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2, // Android shadow
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.2, // iOS shadow
    shadowRadius: 5, // iOS shadow
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
    color: '#fff',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
  },
  issueDate: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#a9a9a9',
    marginTop: 5,
  },
  downloadButton: {
    paddingLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
    marginVertical: 20,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});