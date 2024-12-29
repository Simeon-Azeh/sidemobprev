import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import Colors from '../../../assets/Utils/Colors';

const Tabs = ({ selectedTab, setSelectedTab, colorScheme }) => (
    <View style={[styles.tabContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
        <TouchableOpacity
            style={[
                styles.tabButton,
                selectedTab === 'Feeds' && {
                    borderBottomColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE,
                    borderBottomWidth: 2,
                },
            ]}
            onPress={() => setSelectedTab('Feeds')}
        >
            <Text style={[styles.tabButtonText, { color: colorScheme === 'light' ? (selectedTab === 'Feeds' ? Colors.PRIMARY : '#333') : Colors.WHITE }]}>Feeds</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
                styles.tabButton,
                selectedTab === 'Communities' && {
                    borderBottomColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE,
                    borderBottomWidth: 2,
                },
            ]}
            onPress={() => setSelectedTab('Communities')}
        >
            <Text style={[styles.tabButtonText, { color: colorScheme === 'light' ? (selectedTab === 'Communities' ? Colors.PRIMARY : '#333') : Colors.WHITE }]}>Communities</Text>
        </TouchableOpacity>
    </View>
);

export default Tabs;