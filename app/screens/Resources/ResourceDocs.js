import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const ResourceDocs = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fileURL, title, exam, year, level, paper } = route.params;
  const [loadPDF, setLoadPDF] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme(); // Get the current color scheme

  const handleDownload = () => {
    setModalVisible(true);
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
    <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#f9f9f9' : Colors.DARK_BACKGROUND }]}>
      <View style={[styles.header, { backgroundColor: colorScheme === 'light' ? 'white' : Colors.DARK_HEADER }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colorScheme === 'light' ? Colors.SECONDARY : '#fff'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colorScheme === 'light' ? Colors.PRIMARY : '#fff' }]}>Questions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>{capitalizeFirstLetter(title)}</Text>
        <View style={styles.infoContainer}>
          <MaterialCommunityIcons name="book-open-page-variant" size={24} color={colorScheme === 'light' ? Colors.PRIMARY : '#fff'} />
          <Text style={[styles.iconText, { color: colorScheme === 'light' ? Colors.PRIMARY : '#fff' }]}>{`${capitalizeFirstLetter(exam)} ${year}`}</Text>
        </View>
        <View style={styles.infoContainer}>
          <MaterialCommunityIcons name="school" size={24} color={colorScheme === 'light' ? Colors.PRIMARY : '#fff'} />
          <Text style={[styles.iconText, { color: colorScheme === 'light' ? Colors.PRIMARY : '#fff' }]}>{level}</Text>
        </View>
        <View style={styles.infoContainer}>
          <MaterialCommunityIcons name="file-document" size={24} color={colorScheme === 'light' ? Colors.PRIMARY : '#fff'} />
          <Text style={[styles.iconText, { color: colorScheme === 'light' ? Colors.PRIMARY : '#fff' }]}>{`Paper ${paper}`}</Text>
        </View>
        {loadPDF ? (
          <View style={styles.pdfViewerContainer}>
            <WebView
              source={{ uri: fileURL }}
              style={styles.pdfViewer}
              containerStyle={{ flex: 1 }}
              originWhitelist={['*']}
              startInLoadingState={true}
              scalesPageToFit={true} // Ensures the PDF fits within the view
              javaScriptEnabled={true} // Enable JavaScript for advanced rendering
              domStorageEnabled={true} // Allow DOM storage for interactive PDFs
            />
          </View>
        ) : (
          <TouchableOpacity style={styles.loadButton} onPress={handleLoadPDF}>
            <Text style={styles.loadButtonText}>Load PDF</Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON }]} onPress={handleDownload}>
            <FontAwesome5 name="download" size={24} color="white" />
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: colorScheme === 'light' ? 'white' : Colors.DARK_SECONDARY, borderColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff', borderWidth: 1 }]} onPress={handleAddToFavorites}>
            <Text style={[styles.buttonText, { color: colorScheme === 'light' ? Colors.PRIMARY : '#fff' }]}>Check Solutions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>You need to be subscribed to download this document.</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON }]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenHeight * 0.05,
  },
  header: {
    height: screenHeight * 0.08,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.05,
  },
  backButton: {
    marginRight: screenWidth * 0.04,
  },
  headerTitle: {
    fontSize: screenHeight * 0.02,
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
  content: {
    padding: screenWidth * 0.05,
  },
  title: {
    fontSize: screenHeight * 0.02,
    fontFamily: 'Poppins-Medium',
    marginBottom: screenHeight * 0.015,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.01,
  },
  iconText: {
    fontSize: screenHeight * 0.015,
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
  pdfViewerContainer: {
    flex: 1,
    height: screenHeight * 0.8, // Ensure it uses the full height of the screen
  },
  pdfViewer: {
    flex: 1,
    
    height: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: screenWidth * 0.8,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ResourceDocs;