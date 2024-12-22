import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const FAQScreen = () => {
  const [collapsed, setCollapsed] = useState({}); // Object to track which sections are collapsed

  const toggleExpand = (index) => {
    setCollapsed(prev => ({
      ...prev,
      [index]: !prev[index], // Toggle the specific index
    }));
  };

  const faqs = [
    {
      question: 'What is the purpose of this app?',
      answer: 'The purpose of this app is to provide a comprehensive platform for learning and tutoring services.',
    },
    {
      question: 'How can I contact support?',
      answer: 'You can contact support through the Live Chat feature or by emailing support@sidecedu.com.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the Forgot Password page and follow the instructions provided.',
    },
    {
      question: 'What is the refund policy?',
      answer: 'Our refund policy allows for a full refund within 30 days of purchase. For more details, please review our refund policy on the website.',
    },
  ];
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.accordionContainer}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => toggleExpand(index)}
          >
            <Text style={styles.question}>{faq.question}</Text>
            <Feather
              name={collapsed[index] ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
          <Collapsible collapsed={!collapsed[index]}>
            <View style={styles.accordionContent}>
              <Text style={styles.answer}>{faq.answer}</Text>
            </View>
          </Collapsible>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
  },
  accordionContainer: {
    marginBottom: 20,
   
  
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  question: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  accordionContent: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  answer: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins',
    color: '#666',
  },
});

export default FAQScreen;
