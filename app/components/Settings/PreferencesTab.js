import React from 'react';
import { View, Text, Switch, Dimensions, StyleSheet, useColorScheme, I18nManager } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import * as Localization from 'expo-localization';

const { width: screenWidth } = Dimensions.get('window');

export default function PreferencesTab({
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications,
}) {
  const colorScheme = useColorScheme();
  const language = Localization.locale;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeTextStyle = colorScheme === 'light' ? styles.lightText : styles.darkText;
  const themeBorderColor = colorScheme === 'light' ? Colors.LIGHT_GRAY : Colors.DARK_BORDER;

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <View style={[styles.preferenceRow, { borderBottomColor: themeBorderColor }]}>
        <Text style={[styles.label, themeTextStyle]}>Email Notifications</Text>
        <Switch
          value={emailNotifications}
          onValueChange={setEmailNotifications}
          trackColor={{ false: Colors.GRAY, true: '#9835ff' }}
          thumbColor={emailNotifications ? '#9835ff' : Colors.GRAY}
        />
      </View>

      <View style={[styles.preferenceRow, { borderBottomColor: themeBorderColor }]}>
        <Text style={[styles.label, themeTextStyle]}>Push Notifications</Text>
        <Switch
          value={pushNotifications}
          onValueChange={setPushNotifications}
          trackColor={{ false: Colors.GRAY, true: '#9835ff' }}
          thumbColor={pushNotifications ? '#9835ff' : Colors.GRAY}
        />
      </View>

      <Text style={[styles.sectionHeader, themeTextStyle]}>Notify me when:</Text>

      <View style={[styles.preferenceRow, { borderBottomColor: themeBorderColor }]}>
        <Text style={[styles.label, themeTextStyle]}>New course is available</Text>
        <Switch
          value={true}
          trackColor={{ false: Colors.GRAY, true: '#9835ff' }}
          thumbColor='#9835ff'
        />
      </View>

      <View style={[styles.preferenceRow, { borderBottomColor: themeBorderColor }]}>
        <Text style={[styles.label, themeTextStyle]}>Account login from new device</Text>
        <Switch
          value={false}
          trackColor={{ false: Colors.GRAY, true: '#9835ff' }}
          thumbColor={Colors.GRAY}
        />
      </View>

      <View style={[styles.preferenceRow, { borderBottomColor: themeBorderColor }]}>
        <Text style={[styles.label, themeTextStyle]}>New message received</Text>
        <Switch
          value={false}
          trackColor={{ false: Colors.GRAY, true: '#9835ff' }}
          thumbColor={Colors.GRAY}
        />
      </View>

      <View style={[styles.preferenceRow, { borderBottomColor: themeBorderColor }]}>
        <Text style={[styles.label, themeTextStyle]}>New comment on your post</Text>
        <Switch
          value={true}
          trackColor={{ false: Colors.GRAY, true: '#9835ff' }}
          thumbColor='#9835ff'
        />
      </View>

      <Text style={[styles.sectionHeader, themeTextStyle]}>Appearance</Text>
      <View style={[styles.uneditableRow, { borderColor: themeBorderColor }]}>
        <Text style={[styles.uneditableText, themeTextStyle]}>{colorScheme.charAt(0).toUpperCase() + colorScheme.slice(1)}</Text>
      </View>

      <Text style={[styles.sectionHeader, themeTextStyle]}>Language</Text>
      <View style={[styles.uneditableRow, { borderColor: themeBorderColor }]}>
        <Text style={[styles.uneditableText, themeTextStyle]}>{language}</Text>
      </View>

      <Text style={[styles.sectionHeader, themeTextStyle]}>Time Zone</Text>
      <View style={[styles.uneditableRow, { borderColor: themeBorderColor }]}>
        <Text style={[styles.uneditableText, themeTextStyle]}>{timeZone}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  lightContainer: {
    backgroundColor: Colors.WHITE,
  },
  darkContainer: {
    backgroundColor: Colors.DARK_BACKGROUND,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  label: {
    fontFamily: 'Poppins',
    fontSize: screenWidth * 0.04,
    flex: 1,
  },
  lightText: {
    color: Colors.SECONDARY,
  },
  darkText: {
    color: Colors.DARK_TEXT,
  },
  sectionHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: screenWidth * 0.045,
    marginVertical: 15,
  },
  uneditableRow: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
  },
  uneditableText: {
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.04,
  },
});