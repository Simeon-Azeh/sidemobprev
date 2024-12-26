import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, Dimensions, StyleSheet, useColorScheme, Alert, ActivityIndicator } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import PlanCard from './PlanCard';
import PaymentMethodCard from './PaymentMethodCard';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, updateDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PaymentTab({ autoRenewal, setAutoRenewal }) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState('Free');
  const [billingHistory, setBillingHistory] = useState([]);

  const themeTextStyle = colorScheme === 'light' ? styles.lightText : styles.darkText;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeButtonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;

  useEffect(() => {
    fetchBillingHistory();
  }, []);

  const fetchBillingHistory = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const q = query(collection(db, 'plans'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map(doc => doc.data());
        setBillingHistory(history);
      }
    } catch (error) {
      console.error('Error fetching billing history:', error);
    }
  };

  const handlePlanSelection = async (plan) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Check if the user has already selected a plan this month
        const q = query(
          collection(db, 'plans'),
          where('userId', '==', user.uid),
          where('plan', '==', plan)
        );
        const querySnapshot = await getDocs(q);
        const existingPlan = querySnapshot.docs.find(doc => {
          const planDate = new Date(doc.data().date);
          return planDate.getMonth() === currentMonth && planDate.getFullYear() === currentYear;
        });

        if (existingPlan) {
          Alert.alert('Error', 'You have already selected this plan this month.');
        } else {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, { plan });

          const planRef = collection(db, 'plans');
          await addDoc(planRef, {
            userId: user.uid,
            plan,
            date: new Date().toISOString(),
          });

          setActivePlan(plan);
          Alert.alert('Success', `Plan updated to ${plan}!`);
          fetchBillingHistory();
        }
      } else {
        Alert.alert('Error', 'No authenticated user found.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update plan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Text style={[styles.headerText, themeTextStyle]}>Your Plan</Text>

      {/* Plan Cards */}
      <View style={styles.planContainer}>
        <PlanCard 
          name="Free" 
          price="0 XAF/month" 
          description="Basic access" 
          active={activePlan === 'Free'} 
          onSelect={() => handlePlanSelection('Free')} 
        />
        <PlanCard 
          name="Standard" 
          price="5,000 XAF/year" 
          description="Standard features" 
          active={activePlan === 'Standard'} 
          onSelect={() => handlePlanSelection('Standard')} 
        />
        <PlanCard 
          name="Premium" 
          price="10,000 XAF/year" 
          description="All features and courses" 
          active={activePlan === 'Premium'} 
          onSelect={() => handlePlanSelection('Premium')} 
        />
      </View>

      {/* Auto Renewal Switch */}
      <View style={styles.row}>
        <Text style={[styles.label, themeTextStyle]}>Auto Renewal</Text>
        <Switch value={autoRenewal} onValueChange={setAutoRenewal} trackColor={{ false: Colors.GRAY, true: '#9835ff' }} thumbColor={autoRenewal ? '#9835ff' : Colors.GRAY} />
      </View>

      {/* Payment Methods */}
      <Text style={[styles.headerText, themeTextStyle]}>Payment Methods</Text>
      <PaymentMethodCard method="Credit Card" icon="credit-card" />
      <PaymentMethodCard method="PayPal" icon="paypal" />

      {/* Billing Information Button */}
      <TouchableOpacity style={[styles.button, themeButtonStyle]} onPress={() => navigation.navigate('PaymentPage')}>
        <Text style={styles.buttonText}>Billing Information</Text>
      </TouchableOpacity>

      {/* Billing History Section */}
      <Text style={[styles.headerText, themeTextStyle, { marginTop: 20 }]}>Billing History</Text>
      <View style={styles.billingHistory}>
        <View style={styles.billingRow}>
          <Text style={[styles.billingText, themeTextStyle]}>Date</Text>
          <Text style={[styles.billingText, themeTextStyle]}>Plan</Text>
          <Text style={[styles.billingText, themeTextStyle]}>Amount</Text>
          <Text style={[styles.billingText, themeTextStyle]}>Invoice</Text>
        </View>
        {billingHistory.map((entry, index) => (
          <View key={index} style={styles.billingRow}>
            <Text style={[styles.billingText, themeTextStyle]}>{new Date(entry.date).toLocaleDateString()}</Text>
            <Text style={[styles.billingText, themeTextStyle]}>{entry.plan}</Text>
            <Text style={[styles.billingText, themeTextStyle]}>{entry.plan === 'Free' ? '0 XAF' : entry.plan === 'Standard' ? '5,000 XAF' : '10,000 XAF'}</Text>
            <TouchableOpacity>
              <Text style={styles.downloadText}>Download</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color={Colors.PRIMARY} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  lightContainer: {
    backgroundColor: Colors.WHITE,
  },
  darkContainer: {
    backgroundColor: Colors.DARK_BACKGROUND,
  },
  planContainer: {
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.03,
  },
  lightText: {
    color: Colors.SECONDARY,
  },
  darkText: {
    color: Colors.DARK_TEXT,
  },
  headerText: {
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.04,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: screenHeight * 0.02,
    alignItems: 'center',
    marginBottom: screenHeight * 0.02,
  },
  lightButton: {
    backgroundColor: Colors.PRIMARY,
  },
  darkButton: {
    backgroundColor: Colors.DARK_BUTTON,
    borderColor: Colors.DARK_BORDER,
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  billingHistory: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 10,
    padding: 15,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  billingText: {
    fontFamily: 'Poppins',
    fontSize: screenWidth * 0.03,
    flex: 1,
  },
  downloadText: {
    color: Colors.PRIMARY,
    fontFamily: 'Poppins-Medium',
    textDecorationLine: 'underline',
  },
});