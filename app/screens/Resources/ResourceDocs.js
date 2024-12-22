import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ResourceDocs = () => {
  const navigation = useNavigation();
  const [loadPDF, setLoadPDF] = useState(false);

  const handleDownload = () => {
    console.log('Download button pressed');
  };

  const handleAddToFavorites = () => {
    console.log('Add to Favorites button pressed');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLoadPDF = () => {
    setLoadPDF(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.SECONDARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Questions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mathematics PII</Text>
        <View style={styles.infoContainer}>
          <MaterialCommunityIcons name="book-open-page-variant" size={24} color={Colors.PRIMARY} />
          <Text style={styles.iconText}>GCE 2020</Text>
        </View>
        <View style={styles.infoContainer}>
          <MaterialCommunityIcons name="school" size={24} color={Colors.PRIMARY} />
          <Text style={styles.iconText}>Advanced</Text>
        </View>

        {loadPDF ? (
          <WebView
            source={{ uri: 'https://drive.google.com/file/d/1s1JaLCIy3BCcNnYrwMJMmW-l56K8jDxg/view?usp=sharing' }}
            style={styles.pdfViewer}
            containerStyle={{ backgroundColor: 'white', flex: 1 }}
            originWhitelist={['*']}
            startInLoadingState={true}
          />
        ) : (
          <TouchableOpacity style={styles.loadButton} onPress={handleLoadPDF}>
            <Text style={styles.loadButtonText}>Load PDF</Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDownload}>
            <FontAwesome5 name="download" size={24} color="white" />
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.button, backgroundColor: 'white', borderColor: Colors.PRIMARY , borderWidth: 1}} onPress={handleAddToFavorites}>
           
            <Text style={{ ...styles.buttonText, color: Colors.PRIMARY }}>Check Solutions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: screenHeight * 0.05,
  },
  header: {
    height: screenHeight * 0.08,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.05,
  },
  backButton: {
    marginRight: screenWidth * 0.04,
  },
  headerTitle: {
    fontSize: screenHeight * 0.02,
    color: Colors.PRIMARY,
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
  content: {
    padding: screenWidth * 0.05,
  },
  title: {
    fontSize: screenHeight * 0.02,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: screenHeight * 0.015,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.01,
  },
  iconText: {
    fontSize: screenHeight * 0.015,
    color: Colors.PRIMARY,
    marginLeft: screenWidth * 0.02,
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
  loadButton: {
    backgroundColor: Colors.PRIMARY,
    padding: screenHeight * 0.01,
    borderRadius: screenWidth * 0.03,
    alignItems: 'center',
    marginBottom: screenHeight * 0.03,
  },
  loadButtonText: {
    color: 'white',
    fontSize: screenHeight * 0.015,
    fontFamily: 'Poppins-Medium',
  },
  pdfViewer: {
    width: '100%',
    height: screenHeight * 0.7,
    backgroundColor: 'white',
    borderRadius: screenWidth * 0.03,
    marginBottom: screenHeight * 0.03,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: screenHeight * 0.012,
    borderRadius: screenWidth * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
   

    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins-Medium',
  },
});

export default ResourceDocs;
