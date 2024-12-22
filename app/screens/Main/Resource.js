import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Header from '../../components/General/Header';
import ResourceCategoryCarousel from '../../components/Resources/ResourceCategoryCarousel';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SolutionsImg from '../../../assets/Images/SolutionImg.png'

const { width } = Dimensions.get('window');

const sampleResources = {
  questions: {
    popular: [
      {
        subject: 'Mathematics PII',
        examType: 'GCE 2020',
        level: 'ADVANCED',
        ratings: 4.6,
        reviews: 150,
        image: 'https://img.freepik.com/free-psd/3d-rendering-questions-background_23-2151455628.jpg?t=st=1723124676~exp=1723128276~hmac=c5d9f139d10a6764ee9a7877d763b3d71b5bb44ffc743afe5554c8ad50531ed5&w=740',
      },
      {
        subject: 'Biology PI',
        examType: 'GCE 2019',
        level: 'ADVANCED',
        ratings: 4.3,
        reviews: 100,
        image: 'https://img.freepik.com/free-psd/3d-rendering-questions-background_23-2151455628.jpg?t=st=1723124676~exp=1723128276~hmac=c5d9f139d10a6764ee9a7877d763b3d71b5bb44ffc743afe5554c8ad50531ed5&w=740',
      },
      {
        subject: 'Chemistry PI',
        examType: 'WAEC 2019',
        level: 'ADVANCED',
        ratings: 4.3,
        reviews: 100,
        image: 'https://img.freepik.com/free-psd/3d-rendering-questions-background_23-2151455628.jpg?t=st=1723124676~exp=1723128276~hmac=c5d9f139d10a6764ee9a7877d763b3d71b5bb44ffc743afe5554c8ad50531ed5&w=740',
      },
    ],
    NewUploads: [
      {
        subject: 'Chemistry PII',
        examType: 'GCE 2024',
        level: 'Alevel',
        ratings: 4.8,
        reviews: 80,
        image: 'https://img.freepik.com/free-psd/3d-rendering-questions-background_23-2151455628.jpg?t=st=1723124676~exp=1723128276~hmac=c5d9f139d10a6764ee9a7877d763b3d71b5bb44ffc743afe5554c8ad50531ed5&w=740',
      },
    ],
  
  },
  solutions: {
    popular: [
      {
        subject: 'Physics PI',
        examType: 'GCE 2019',
        level: 'Olevel',
        ratings: 4.3,
        reviews: 100,
        image: 'https://img.freepik.com/premium-vector/light-bulb-with-gears-gears-it_1108514-57566.jpg?w=740',
      },
    ],
    NewUploads: [
      {
        subject: 'Maths & Mech PIII',
        examType: 'GCE 2024',
        level: 'Alevel',
        ratings: 4.7,
        reviews: 60,
        image: 'https://img.freepik.com/premium-vector/light-bulb-with-gears-gears-it_1108514-57566.jpg?w=740',
      },
      {
        subject: 'Biology PIII',
        examType: 'GCE 2023',
        level: 'Alevel',
        ratings: 4.7,
        reviews: 60,
        image: 'https://img.freepik.com/premium-vector/light-bulb-with-gears-gears-it_1108514-57566.jpg?w=740',
      },
      {
        subject: 'Food Science I',
        examType: 'GCE 2023',
        level: 'Alevel',
        ratings: 4.7,
        reviews: 60,
        image: 'https://img.freepik.com/premium-vector/light-bulb-with-gears-gears-it_1108514-57566.jpg?w=740',
      },
    ],
 
  },
};

const filterOptions = {
  years: ['2020', '2021', '2022', '2023'],
  disciplines: ['Arts', 'Science', 'Tech'],
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
  levels: ['Alevel', 'Olevel'],
  papers: ['Paper 1', 'Paper 2', 'Paper 3'],
};

const FilterModal = ({ isVisible, onClose, onApply }) => {
  const [selectedYearFirst, setSelectedYearStart] = useState(null);
  const [selectedYearEnd, setSelectedYearEnd] = useState(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Filter Resources</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedYearStart(value)}
          items={filterOptions.years.map(year => ({ label: year, value: year }))}
          placeholder={{ label: 'From Year', value: null }}
          style={pickerStyles}
        />
        <RNPickerSelect
          onValueChange={(value) => setSelectedYearEnd(value)}
          items={filterOptions.years.map(year => ({ label: year, value: year }))}
          placeholder={{ label: 'To Year', value: null }}
          style={pickerStyles}
        />
        <RNPickerSelect
          onValueChange={(value) => setSelectedDiscipline(value)}
          items={filterOptions.disciplines.map(discipline => ({ label: discipline, value: discipline }))}
          placeholder={{ label: 'Select Discipline', value: null }}
          style={pickerStyles}
        />
        <RNPickerSelect
          onValueChange={(value) => setSelectedSubject(value)}
          items={filterOptions.subjects.map(subject => ({ label: subject, value: subject }))}
          placeholder={{ label: 'Select Subject', value: null }}
          style={pickerStyles}
        />
        <RNPickerSelect
          onValueChange={(value) => setSelectedLevel(value)}
          items={filterOptions.levels.map(level => ({ label: level, value: level }))}
          placeholder={{ label: 'Select Level', value: null }}
          style={pickerStyles}
        />
        <RNPickerSelect
          onValueChange={(value) => setSelectedPaper(value)}
          items={filterOptions.papers.map(paper => ({ label: paper, value: paper }))}
          placeholder={{ label: 'Select Paper', value: null }}
          style={pickerStyles}
        />
        <View style={styles.modalButtons}>
          <Button
            title="Apply Filters"
            color={Colors.PRIMARY}
            onPress={() => {
              onApply({ selectedYearFirst, selectedYearEnd, selectedDiscipline, selectedSubject, selectedLevel, selectedPaper });
              onClose();
            }}
          />
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const FloatingFilterButton = ({ onPress }) => (
  <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
    <Icon name="filter-list" size={40} color="#fff" />
  </TouchableOpacity>
);

const QuestionsTab = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const handleApplyFilters = (filters) => {
    console.log('Applied filters:', filters);
    // Apply filters to the resource data
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ResourceCategoryCarousel title="Recommended Questions" data={sampleResources.questions.popular} />
        <ResourceCategoryCarousel title="New Uploads" data={sampleResources.questions.NewUploads} />
     
      </ScrollView>
      <FloatingFilterButton onPress={() => setModalVisible(true)} />
      <FilterModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} onApply={handleApplyFilters} />
    </View>
  );
};

const SolutionsTab = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const handleApplyFilters = (filters) => {
    console.log('Applied filters:', filters);
    // Apply filters to the resource data
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ResourceCategoryCarousel title="Popular Solutions" data={sampleResources.solutions.popular} />
        <ResourceCategoryCarousel title="New Uploads" data={sampleResources.solutions.NewUploads} />
       
      </ScrollView>
      <FloatingFilterButton onPress={() => setModalVisible(true)} />
      <FilterModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} onApply={handleApplyFilters} />
    </View>
  );
};

const renderScene = SceneMap({
  questions: QuestionsTab,
  solutions: SolutionsTab,
});

export default function Resource() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'questions', title: 'Questions' },
    { key: 'solutions', title: 'Solutions' },
  ]);

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        style={{ marginTop: 0 }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#9835FF', height: 3 }}
            style={{ backgroundColor: '#fff' }}
            labelStyle={{ color: Colors.SECONDARY, fontFamily: 'Poppins-Medium' }}
            activeColor="#9835FF"
            inactiveColor="gray"
            pressColor="#f9feff"
          />
        )}
      />
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  inputAndroid: {
    color: '#000',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  inputIOS: {
    color: '#000',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  placeholder: {
    color: '#999',
  },
});

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'flex-end',
    marginLeft: 'auto',
  },
  closeButton: {
    color: Colors.SECONDARY,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    borderWidth: 1,
    borderColor: Colors.SECONDARY,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: 15,
  
    paddingBottom: 70, // Space for floating button
  },
});
