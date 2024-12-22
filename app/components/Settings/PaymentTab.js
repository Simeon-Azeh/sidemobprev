import React from 'react';
import { View, Text, Switch, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import PlanCard from './PlanCard';
import PaymentMethodCard from './PaymentMethodCard';
import { useNavigation } from '@react-navigation/native';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PaymentTab({ autoRenewal, setAutoRenewal }) {
  const navigation = useNavigation();
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.03 }}>Your Plan</Text>
      <View style={{ marginVertical: 20 }}>
        <PlanCard name="Free" price="$0/month" description="Basic access" active />
        <PlanCard name="Standard" price="$9.99/year" description="Standard features" />
        <PlanCard name="Premium" price="$19.99/year" description="All features and courses" />
      </View>
      <View style={styles.row}>
        <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.03 }}>Auto Renewal</Text>
        <Switch value={autoRenewal} onValueChange={setAutoRenewal} trackColor={{ false: Colors.GRAY, true: '#9835ff' }} thumbColor={Colors.GRAY} />
      </View>
      <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.03 }}>Payment Methods</Text>
      <PaymentMethodCard method="Credit Card" icon="credit-card" />
      <PaymentMethodCard method="PayPal" icon="paypal" />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PaymentPage')}>
        <Text style={styles.buttonText}>Billing Information</Text>
      </TouchableOpacity>
      <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.03, marginTop: 20 }}>Billing History</Text>
      <View style={styles.billingHistory}>
        <View style={styles.billingRow}>
          <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Date</Text>
          <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Reason</Text>
          <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Amount</Text>
          <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Invoice</Text>
        </View>
        <View style={styles.billingRow}>
          <Text style={{ fontFamily: 'Poppins', color: Colors.SECONDARY }}>01/08/2024</Text>
          <Text style={{ fontFamily: 'Poppins', color: Colors.SECONDARY }}>Subscription</Text>
          <Text style={{ fontFamily: 'Poppins', color: Colors.SECONDARY }}>$9.99</Text>
          <TouchableOpacity >
            <Text style={{ color: Colors.PRIMARY, fontFamily: 'Poppins-Medium' }}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center'
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 5,
    marginTop: screenHeight * 0.02, 
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium'
  },
  billingHistory: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 5,
    padding: 10
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5
  }
};