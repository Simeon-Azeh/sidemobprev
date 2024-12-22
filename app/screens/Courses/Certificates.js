import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Colors from '../../../assets/Utils/Colors';

const certificates = [
  {
    title: 'React Native for Beginners',
    issueDate: 'June 20, 2024',
    image: 'https://img.freepik.com/free-vector/laurel-wreaths-symbol-victory-glory-success_87202-1201.jpg?t=st=1723143516~exp=1723147116~hmac=65dc4fba063ee7b9bd29ff05a50bb4ca9925f1f6b3cd73a0f8bdf7f58412b624&w=740',
  },
  {
    title: 'Advanced Flutter Development',
    issueDate: 'July 15, 2024',
    image: 'https://img.freepik.com/free-vector/laurel-wreaths-symbol-victory-glory-success_87202-1201.jpg?t=st=1723143516~exp=1723147116~hmac=65dc4fba063ee7b9bd29ff05a50bb4ca9925f1f6b3cd73a0f8bdf7f58412b624&w=740',
  },
  {
    title: 'Data Structures & Algorithms',
    issueDate: 'August 10, 2024',
    image: 'https://img.freepik.com/free-vector/laurel-wreaths-symbol-victory-glory-success_87202-1201.jpg?t=st=1723143516~exp=1723147116~hmac=65dc4fba063ee7b9bd29ff05a50bb4ca9925f1f6b3cd73a0f8bdf7f58412b624&w=740',
  },
];

export default function Certificate() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Your Certificates</Text>
      {certificates.map((certificate, index) => (
        <View key={index} style={styles.certificateCard}>
          <Image source={{ uri: certificate.image }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.title}>{certificate.title}</Text>
            <Text style={styles.issueDate}>Issued on: {certificate.issueDate}</Text>
          </View>
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
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.2, // iOS shadow
    shadowRadius: 5, // iOS shadow
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  info: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
  },
  issueDate: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#a9a9a9',
    marginTop: 5,
  },
});
