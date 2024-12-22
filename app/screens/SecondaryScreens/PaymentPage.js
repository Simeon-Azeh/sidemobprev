import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, Image } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import { FontAwesome5, MaterialIcons, Ionicons, Fontisto } from '@expo/vector-icons';
import PaymentImg from '../../../assets/Images/PaymentImg.png';
import PaymentSuccess from '../../../assets/Images/PaymentSuccess.png';

const { width, height } = Dimensions.get('window');

const PaymentPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [bankDetails, setBankDetails] = useState({ accountNumber: '', routingNumber: '' });
  const [mobileMoneyDetails, setMobileMoneyDetails] = useState({ phoneNumber: '' });
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    type: 'Card', // This could be 'Card', 'Bank', or 'Mobile'
    details: {
      number: '1234567890123456', // Card number (only for example)
      expiry: '12/25', // Example expiry
      cvv: '123',
    },
  });

  const paymentMethods = [
    { name: 'Card', label: 'Credit Card', icon: <FontAwesome5 name="credit-card" size={24} color={Colors.SECONDARY} /> },
    { name: 'PayPal', label: 'PayPal', icon: <Fontisto name="paypal" size={24} color={Colors.SECONDARY} /> },
    { name: 'Bank', label: 'Bank Transfer', icon: <MaterialIcons name="account-balance" size={24} color={Colors.SECONDARY} /> },
    { name: 'Mobile', label: 'Mobile Money', icon: <Ionicons name="phone-portrait-outline" size={24} color={Colors.SECONDARY} /> },
  ];

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleConfirmPayment = () => {
    setIsPaymentSuccessful(true);
  };

  const handleEditBillingInfo = () => {
    // Logic to edit billing information
    setSelectedPaymentMethod(billingInfo.type);
    if (billingInfo.type === 'Card') {
      setCardDetails({
        number: billingInfo.details.number,
        expiry: billingInfo.details.expiry,
        cvv: billingInfo.details.cvv,
      });
    }
    // Add similar logic for 'Bank' and 'Mobile' if needed
  };

  const handleDeleteBillingInfo = () => {
    // Logic to delete billing information
    setBillingInfo(null);
    setSelectedPaymentMethod(null);
    setCardDetails({ number: '', expiry: '', cvv: '' });
    setBankDetails({ accountNumber: '', routingNumber: '' });
    setMobileMoneyDetails({ phoneNumber: '' });
  };

  const maskCardNumber = (number) => {
    if (number.length < 6) return number;
    const firstThree = number.slice(0, 3);
    const lastThree = number.slice(-3);
    return `${firstThree}******${lastThree}`;
  };

  if (isPaymentSuccessful) {
    return (
      <View style={styles.receiptContainer}>
        <Image source={PaymentSuccess} style={{ width: '100%', height: height * 0.4 }} />
        <Text style={styles.receiptTitle}>Payment Successful</Text>
        <Text style={styles.receiptText}>Order Total: $120.00</Text>
        <Text style={styles.receiptText}>Payment Method: {selectedPaymentMethod}</Text>
        <Text style={styles.receiptText}>Transaction ID: #123456789</Text>
        <TouchableOpacity style={styles.receiptButton}>
          <Text style={styles.receiptButtonText}>Download Receipt</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Card-like Header */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Choose Your Payment Method</Text>
        <Text style={styles.cardSubtitle}>Secure payment with multiple options</Text>
        <Image source={PaymentImg} style={{ width: '100%', height: height * 0.25 }} />
      </View>

      {/* Current Billing Info */}
      {billingInfo && (
        <View style={styles.billingInfoContainer}>
          <Text style={styles.billingInfoTitle}>Current Billing Information</Text>
          {billingInfo.type === 'Card' && (
            <Text style={styles.billingInfoText}>
              Card Number: {maskCardNumber(billingInfo.details.number)}
            </Text>
          )}
          {/* Add similar blocks for 'Bank' and 'Mobile' if needed */}
          <View style={styles.billingInfoActions}>
            <TouchableOpacity onPress={handleEditBillingInfo}>
              <FontAwesome5 name="edit" size={16} color={Colors.SECONDARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteBillingInfo} style={{ marginLeft: 20 }}>
              <FontAwesome5 name="trash" size={16} color={Colors.SECONDARY} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Payment Method Selection */}
      <View style={styles.paymentMethodsContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.name}
            style={[
              styles.paymentMethodBox,
              selectedPaymentMethod === method.name && styles.selectedPaymentMethodBox,
            ]}
            onPress={() => handlePaymentMethodSelect(method.name)}
          >
            {method.icon}
            <Text style={styles.paymentMethodText}>{method.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conditional Inputs Based on Selected Payment Method */}
      {selectedPaymentMethod === 'Card' && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            value={cardDetails.number}
            onChangeText={(text) => setCardDetails({ ...cardDetails, number: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry Date (MM/YY)"
            keyboardType="numeric"
            value={cardDetails.expiry}
            onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            keyboardType="numeric"
            value={cardDetails.cvv}
            onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
          />
        </View>
      )}

      {selectedPaymentMethod === 'Bank' && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Account Number"
            keyboardType="numeric"
            value={bankDetails.accountNumber}
            onChangeText={(text) => setBankDetails({ ...bankDetails, accountNumber: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Routing Number"
            keyboardType="numeric"
            value={bankDetails.routingNumber}
            onChangeText={(text) => setBankDetails({ ...bankDetails, routingNumber: text })}
          />
        </View>
      )}

      {selectedPaymentMethod === 'Mobile' && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mobile Money Number"
            keyboardType="numeric"
            value={mobileMoneyDetails.phoneNumber}
            onChangeText={(text) => setMobileMoneyDetails({ ...mobileMoneyDetails, phoneNumber: text })}
          />
        </View>
      )}

      {/* Payment Description and Total */}
      <Text style={styles.description}>Payment Description: Purchase of digital resources for one year.</Text>
      <Text style={styles.orderTotal}>Order Total: $19.99</Text>

      {/* Confirm Payment Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
        <Text style={styles.confirmButtonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  card: {
    backgroundColor: Colors.PRIMARY,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    width: width - 40, // Adjusting width for padding
  },
  cardTitle: {
    fontSize: width * 0.035,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  cardSubtitle: {
    fontSize: width * 0.03,
    color: 'white',
    fontFamily: 'Poppins',
  },
  billingInfoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderColor: Colors.SECONDARY,
    borderWidth: 1,
    marginBottom: 20,
  },
  billingInfoTitle: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 10,
  },
  billingInfoText: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins',
    color: Colors.SECONDARY,
  },
  billingInfoActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  paymentMethodsContainer: {
    marginBottom: 20,
  },
  paymentMethodBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderColor: Colors.SECONDARY,
    borderWidth: 1,
    marginBottom: 10,
  },
  selectedPaymentMethodBox: {
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
  },
  paymentMethodText: {
    fontSize: width * 0.035,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
    marginLeft: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 20,
    marginTop: 10,
    fontSize: width * 0.03,
    backgroundColor: '#fff',
    width: width - 40, // Adjusting width for padding
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  description: {
    fontSize: width * 0.035,
    color: Colors.SECONDARY,
    marginBottom: 10,
    width: width - 40, // Adjusting width for padding
    fontFamily: 'Poppins',

  },
  orderTotal: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
    marginBottom: 20,
    width: width - 40, // Adjusting width for padding
  },
  confirmButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: width - 40, // Adjusting width for padding
  },
  confirmButtonText: {
    color: 'white',
    fontSize: width * 0.03,
    fontFamily: 'Poppins-Medium',
  },
  receiptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  receiptTitle: {
    fontSize: width * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
    marginBottom: 20,
  },
  receiptText: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins',
    color: Colors.SECONDARY,
    marginBottom: 10,
  },
  receiptButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  receiptButtonText: {
    color: 'white',
    fontSize: width * 0.03,
    fontFamily: 'Poppins-Medium',
  },
});

export default PaymentPage;
