import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import Profileavatar from '../../../assets/Images/avatar4.jpg';
import Colors from '../../../assets/Utils/Colors';
import awardone from '../../../assets/Images/award_one.jpg';
import awardtwo from '../../../assets/Images/award_two.jpg'; 
import awardthree from '../../../assets/Images/award_three.jpg';
import awardfour from '../../../assets/Images/award_four.jpg';
import { FontAwesome } from '@expo/vector-icons'; // FontAwesome
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'; // FontAwesome5

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Profile() {
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingVertical: 20, backgroundColor: 'white' }}>
      {/* Avatar and Name */}
      <View>
        <Image 
          source={Profileavatar} 
          style={{ 
            width: screenWidth * 0.3, 
            height: screenHeight * 0.14, 
            borderRadius: (screenWidth * 0.3) / 2 
          }} 
        />
      </View>
      <View>
      <Text style={{ 
          fontSize: screenWidth * 0.03, 
          fontFamily: 'Poppins-Medium', 
          color: Colors.WHITE, 
          backgroundColor: Colors.SECONDARY, 
          paddingHorizontal: 10, 
          paddingVertical: 5, 
          textAlign: 'center', 
          width: '50%', 
          alignSelf: 'center', 
          borderRadius: 5, 
          marginVertical: 20
        }}>
          Beta User
        </Text>
        <Text style={{ fontSize: screenWidth * 0.05, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY,}}>
          Simeon Azeh Kongnyuy
        </Text>
       
      </View>

      {/* Courses Info */}
      <View style={{ flexDirection: 'row', marginVertical: 40, gap: 40 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ 
            fontSize: screenWidth * 0.05, 
            fontFamily: 'Poppins-Medium', 
            color: Colors.SECONDARY, 
            backgroundColor: '#F9FBFE', 
            paddingHorizontal: 10, 
            paddingVertical: 5, 
            textAlign: 'center', 
            borderRadius: 50 
          }}>
            04
          </Text>
          <Text style={{ fontSize: screenWidth * 0.03, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>
            Courses Enrolled
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ 
            fontSize: screenWidth * 0.05, 
            fontFamily: 'Poppins-Medium', 
            color: Colors.PRIMARY, 
            backgroundColor: '#F9FBFE', 
            paddingHorizontal: 10, 
            paddingVertical: 5, 
            textAlign: 'center', 
            borderRadius: 50 
          }}>
            02
          </Text>
          <Text style={{ fontSize: screenWidth * 0.03, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>
            Courses Completed
          </Text>
        </View>
      </View>

      {/* Badges Section */}
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Text style={{ fontSize: screenWidth * 0.045, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, marginBottom: 10 }}>
          Badges
        </Text>
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: 10 
        }}>
          <Image source={awardone} style={{ width: screenWidth * 0.18, height: screenWidth * 0.18, margin: 10 }} />
          <Image source={awardtwo} style={{ width: screenWidth * 0.18, height: screenWidth * 0.18, margin: 10 }} />
          <Image source={awardthree} style={{ width: screenWidth * 0.18, height: screenWidth * 0.18, margin: 10 }} />
          <Image source={awardfour} style={{ width: screenWidth * 0.18, height: screenWidth * 0.18, margin: 10 }} />
        </View>
      </View>

      {/* Quick Action Boxes */}
      <View style={{ width: '100%', marginTop: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <QuickActionBox icon="chalkboard-teacher" text="Become a Tutor" isFontAwesome5 />
          <QuickActionBox icon="question-circle" text="Need Support" />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
          <QuickActionBox icon="user-plus" text="Invite Friends" />
          <QuickActionBox icon="eye" text="Change Visibility" />
        </View>
      </View>
    </View>  
  );
}

function QuickActionBox({ icon, text, isFontAwesome5 = false }) {
  return (
    <TouchableOpacity style={{ 
      width: screenWidth * 0.4, 
      paddingVertical: 15, 
      alignItems: 'center', 
      backgroundColor: '#F9FBFE', 
      borderRadius: 10 
    }}>
      {isFontAwesome5 ? (
        <FontAwesome5 name={icon} size={24} color={Colors.SECONDARY} />
      ) : (
        <FontAwesome name={icon} size={24} color={Colors.SECONDARY} />
      )}
      <Text style={{ 
        marginTop: 10, 
        fontSize: screenWidth * 0.035, 
        fontFamily: 'Poppins-Medium', 
        color: Colors.SECONDARY 
      }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
