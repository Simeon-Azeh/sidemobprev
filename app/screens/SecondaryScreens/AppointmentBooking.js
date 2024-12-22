import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const AppointmentBooking = ({ tutor }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingType, setBookingType] = useState('online');
  const [bookingLevel, setBookingLevel] = useState('OLEVEL');
  const [selectedHours, setSelectedHours] = useState('1 hour');
  const [selectedTime, setSelectedTime] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const hourlyRate = 20; // Example hourly rate in XAF
  const numberOfDays = (endDate && startDate) ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 0;
  const dailyHours = parseInt(selectedHours, 10);
  const totalPrice = dailyHours * hourlyRate * numberOfDays;

  const timeSlots = [
    { time: '09:00 AM', booked: false },
    { time: '10:00 AM', booked: false },
    { time: '11:00 AM', booked: true },
    { time: '12:00 PM', booked: false },
    { time: '01:00 PM', booked: false },
    { time: '02:00 PM', booked: true },
    { time: '03:00 PM', booked: false },
    { time: '04:00 PM', booked: false },
  ];

  const HoursDaily = [
    { hour: '1 hour', booked: false },
    { hour: '2 hours', booked: false },
    { hour: '3 hours', booked: true },
    { hour: '4 hours', booked: false },
    { hour: '5 hours', booked: false },
    { hour: '6 hours', booked: true },
    { hour: '7 hours', booked: false },
    { hour: '8 hours', booked: false },
  ];

  useEffect(() => {
    // Update the total price whenever the selectedHours or date range changes
    setSelectedHours((prev) => prev || '1 hour');
  }, [selectedHours, startDate, endDate]);

  const onDateChange = (event, selectedDate, isStartDate) => {
    const currentDate = selectedDate || new Date();
    if (isStartDate) {
      setShowStartDatePicker(Platform.OS === 'ios');
      setStartDate(currentDate);
    } else {
      setShowEndDatePicker(Platform.OS === 'ios');
      setEndDate(currentDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.tutorInfo}>
        <View style={styles.imageContainer}>
          <FontAwesome5 name="user-tie" size={120} color="#ccc" />
        </View>
        <Text style={styles.tutorName}>Tutor Name</Text>
        <Text style={styles.tutorDescription}>Some description about this tutor, her bio and some basic info</Text>
        <Text style={styles.tutorSubjects}>Chemistry, Biology</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.icon}>
            <FontAwesome5 name="phone-alt" size={24} color="#9835ff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <FontAwesome5 name="envelope" size={24} color="#9835ff" />
          </TouchableOpacity>
        </View>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={24} color="#ccc" />
          <Text style={styles.locationText}>123 Anywhere st, Buea, Cameroon</Text>
        </View>
      </View>

      <View style={styles.bookingForm}>
        <Text style={styles.heading}>Select Booking Type</Text>
        <View style={styles.bookingTypeContainer}>
          <TouchableOpacity
            style={[styles.bookingTypeButton, bookingType === 'online' && styles.selectedBookingType]}
            onPress={() => setBookingType('online')}
          >
            <Text style={styles.bookingTypeText}>Online</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bookingTypeButton, bookingType === 'in-person' && styles.selectedBookingType]}
            onPress={() => setBookingType('in-person')}
          >
            <Text style={styles.bookingTypeText}>In-Person</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>Select Level</Text>
        <View style={styles.levelContainer}>
          <TouchableOpacity
            style={[styles.levelButton, bookingLevel === 'OLEVEL' && styles.selectedLevel]}
            onPress={() => setBookingLevel('OLEVEL')}
          >
            <Text style={styles.levelText}>Ordinary Level</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.levelButton, bookingLevel === 'ALEVEL' && styles.selectedLevel]}
            onPress={() => setBookingLevel('ALEVEL')}
          >
            <Text style={styles.levelText}>Advanced Level</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>Select Date Range</Text>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePicker}>
            <Text style={styles.dateText}>{startDate ? startDate.toDateString() : 'Start Date'}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => onDateChange(event, date, true)}
            />
          )}
          <Text style={styles.arrow}>→</Text>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePicker}>
            <Text style={styles.dateText}>{endDate ? endDate.toDateString() : 'End Date'}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => onDateChange(event, date, false)}
            />
          )}
        </View>

        <Text style={styles.heading}>Select Hours per day</Text>
        <View style={styles.hoursContainer}>
          {HoursDaily.map((hours, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.hoursButton, hours.booked && styles.bookedHours, selectedHours === hours.hour && styles.selectedHours]}
              onPress={() => !hours.booked && setSelectedHours(hours.hour)}
            >
              <Text style={styles.hoursText}>{hours.hour}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.heading}>Select Time Slot</Text>
        <View style={styles.timeSlotsContainer}>
          {timeSlots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.timeSlotButton, slot.booked && styles.bookedTimeSlot, selectedTime === slot.time && styles.selectedTimeSlot]}
              onPress={() => !slot.booked && setSelectedTime(slot.time)}
            >
              <Text style={styles.timeSlotText}>{slot.time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.heading}>Price</Text>
        <Text style={styles.priceText}>XAF {totalPrice.toLocaleString()}</Text>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => Alert.alert('Booking Confirmed!')}
        >
          <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  tutorInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    backgroundColor: '#f0f0f0',
    width: screenWidth * 0.32,
    height: screenWidth * 0.32,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  tutorName: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 8,
  },
  tutorDescription: {
    fontSize: screenWidth * 0.03,
    color: '#7d7d7d',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Poppins',
    marginBottom: 8,
  },
  tutorSubjects: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: '#9835ff',
    marginBottom: 16,
  },
  iconsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  icon: {
    marginHorizontal: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: screenWidth * 0.03,
    color: '#7d7d7d',
    marginLeft: 8,
    fontFamily: 'Poppins',
  },
  bookingForm: {
    flex: 1,
  },
  heading: {
    fontSize: screenWidth * 0.035,
   fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 8,
  },
  bookingTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  bookingTypeButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedBookingType: {
    borderColor: '#9835ff',
    backgroundColor: '#9835ff20',
  },
  bookingTypeText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    color: Colors.SECONDARY,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedLevel: {
    borderColor: '#9835ff',
    backgroundColor: '#9835ff20',
  },
  levelText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    color: Colors.SECONDARY,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  datePicker: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  dateText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    color: Colors.SECONDARY,
  },
  arrow: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  hoursButton: {
    flexBasis: '48%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    margin: 4,
    alignItems: 'center',
  },
  selectedHours: {
    borderColor: '#9835ff',
    backgroundColor: '#9835ff20',
  },
  bookedHours: {
    backgroundColor: '#e0e0e0',
  },
  hoursText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    color: Colors.SECONDARY,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  timeSlotButton: {
    flexBasis: '48%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    margin: 4,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    borderColor: '#9835ff',
    backgroundColor: '#9835ff20',
  },
  bookedTimeSlot: {
    backgroundColor: '#e0e0e0',
  },
  timeSlotText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    color: Colors.SECONDARY,
  },
  priceText: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
  },
  confirmButton: {
    padding: 16,
    backgroundColor: '#9835ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.WHITE,
  },
});

export default AppointmentBooking;
