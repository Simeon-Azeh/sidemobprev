import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import ImageViewer from 'react-native-image-zoom-viewer';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const Pagination = ({ currentPage, totalPages, onPageChange, colorScheme }) => {
  const renderPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <TouchableOpacity
            key={i}
            onPress={() => onPageChange(i)}
            style={[
              styles.pageButton,
              currentPage === i && styles.activePageButton,
              {
                backgroundColor: currentPage === i
                  ? colorScheme === 'light' ? Colors.PRIMARY : '#fff'
                  : 'transparent'
              }
            ]}
          >
            <Text
              style={[
                styles.pageButtonText,
                {
                  color: currentPage === i
                    ? colorScheme === 'light' ? '#fff' : '#000'
                    : colorScheme === 'light' ? Colors.SECONDARY : '#fff'
                }
              ]}
            >
              {i}
            </Text>
          </TouchableOpacity>
        );
      }
    } else {
      pages.push(
        <TouchableOpacity
          key={1}
          onPress={() => onPageChange(1)}
          style={[
            styles.pageButton,
            currentPage === 1 && styles.activePageButton,
            {
              backgroundColor: currentPage === 1
                ? colorScheme === 'light' ? Colors.PRIMARY : '#fff'
                : 'transparent'
            }
          ]}
        >
          <Text style={[styles.pageButtonText, { color: currentPage === 1 ? '#fff' : Colors.SECONDARY }]}>1</Text>
        </TouchableOpacity>
      );

      if (currentPage > 3) {
        pages.push(
          <Text key="leftEllipsis" style={[styles.ellipsis, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>...</Text>
        );
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(
            <TouchableOpacity
              key={i}
              onPress={() => onPageChange(i)}
              style={[
                styles.pageButton,
                currentPage === i && styles.activePageButton,
                {
                  backgroundColor: currentPage === i
                    ? colorScheme === 'light' ? Colors.PRIMARY : '#fff'
                    : 'transparent'
                }
              ]}
            >
              <Text style={[
                styles.pageButtonText,
                {
                  color: currentPage === i 
                    ? colorScheme === 'light' ? '#fff' : '#000'
                    : colorScheme === 'light' ? Colors.SECONDARY : '#fff'
                }
              ]}>
                {i}
              </Text>
            </TouchableOpacity>
          );
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <Text key="rightEllipsis" style={[styles.ellipsis, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>...</Text>
        );
      }

      pages.push(
        <TouchableOpacity
          key={totalPages}
          onPress={() => onPageChange(totalPages)}
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.activePageButton,
            {
              backgroundColor: currentPage === totalPages
                ? colorScheme === 'light' ? Colors.PRIMARY : '#fff'
                : 'transparent'
            }
          ]}
        >
          <Text style={[
            styles.pageButtonText,
            {
              color: currentPage === totalPages
                ? colorScheme === 'light' ? '#fff' : '#000'
                : colorScheme === 'light' ? Colors.SECONDARY : '#fff'
            }
          ]}>
            {totalPages}
          </Text>
        </TouchableOpacity>
      );
    }

    return pages;
  };

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color={currentPage === 1 ? '#ccc' : colorScheme === 'light' ? Colors.PRIMARY : '#fff'}
        />
      </TouchableOpacity>

      <View style={styles.pageNumbersContainer}>
        {renderPageNumbers()}
      </View>

      <TouchableOpacity
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Ionicons
          name="chevron-forward"
          size={24}
          color={currentPage === totalPages ? '#ccc' : colorScheme === 'light' ? Colors.PRIMARY : '#fff'}
        />
      </TouchableOpacity>
    </View>
  );
};

const ResourceDocs = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { images, title, exam, year, level, paper } = route.params;
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoadButton, setShowLoadButton] = useState(false);
  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  const colorScheme = useColorScheme(); // Get the current color scheme

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowLoadButton(true);
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [loading]);

  const handleDownload = () => {
    setModalVisible(true);
  };

  const handleAddToFavorites = () => {
    console.log('Add to Favorites button pressed');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLoadDocument = () => {
    setLoading(true);
    // Simulate fetching images from Firestore
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= images.length) {
      setCurrentPage(page);
    }
  };

  const handleFullScreen = () => {
    setFullScreenVisible(true);
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
        {loading ? (
          <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loadingIndicator} />
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: images[currentPage - 1].url }} style={styles.image} />
            <TouchableOpacity style={styles.fullScreenButton} onPress={handleFullScreen}>
              <Ionicons name="expand" size={24} color={colorScheme === 'light' ? Colors.PRIMARY : '#fff'} />
            </TouchableOpacity>
            <Text style={[styles.pageNumber, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>
              Page {images[currentPage - 1].pageNo}
            </Text>
          </View>
        )}
        {showLoadButton && !loading && (
          <TouchableOpacity style={[styles.loadButton, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON }]} onPress={handleLoadDocument}>
            <Text style={styles.loadButtonText}>Load Document</Text>
          </TouchableOpacity>
        )}

      
<Pagination
  currentPage={currentPage}
  totalPages={images.length}
  onPageChange={handlePageChange}
  colorScheme={colorScheme}
/>
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

      <Modal
        visible={fullScreenVisible}
        transparent={true}
        onRequestClose={() => setFullScreenVisible(false)}
      >
        <ImageViewer
          imageUrls={images.map(img => ({ url: img.url }))}
          index={currentPage - 1}
          onSwipeDown={() => setFullScreenVisible(false)}
          enableSwipeDown={true}
        />
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
    
  },
  title: {
    fontSize: screenHeight * 0.02,
    fontFamily: 'Poppins-Medium',
    marginBottom: screenHeight * 0.015,
    paddingHorizontal: screenWidth * 0.05,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.05,
  },
  iconText: {
    fontSize: screenHeight * 0.015,
    marginLeft: screenWidth * 0.02,
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
  loadButton: {
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
  imageContainer: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: screenHeight * 0.01,
    borderRadius: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: screenHeight * 0.7,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  fullScreenButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  pageNumber: {
    marginTop: 10,
    fontSize: screenHeight * 0.02,
    fontFamily: 'Poppins-Medium',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '80%',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pageButton: {
    minWidth: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activePageButton: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pageButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  ellipsis: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginHorizontal: 4,
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
  loadingIndicator: {
    marginVertical: screenHeight * 0.03,
  },
});

export default ResourceDocs;