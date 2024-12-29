import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import styles from './styles';

const Community = ({ item, navigateToProfile, colorScheme }) => {
    return (
        <View style={[styles.communityCard, { backgroundColor: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_SECONDARY }]}>
            <View style={styles.communityHeader}>
                <TouchableOpacity onPress={() => navigateToProfile(item.admin)}>
                    <Image source={{ uri: item.admin.profileImageUri }} style={styles.profileImage} />
                </TouchableOpacity>
                <View style={styles.communityInfo}>
                    <TouchableOpacity onPress={() => navigateToProfile(item.admin)}>
                        <View style={styles.userNameContainer}>
                            <Text style={[styles.userName, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>{item.name}</Text>
                            {item.isVerified && (
                                <Ionicons name="checkmark-circle" size={16} color={Colors.PRIMARY} style={styles.verifiedIcon} />
                            )}
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.communityTime, { color: colorScheme === 'light' ? Colors.GRAY : Colors.DARK_TEXT_MUTED }]}>{item.membersCount} Members</Text>
                </View>
                <TouchableOpacity>
                    <Text style={[styles.joinText, { color: Colors.PRIMARY }]}>Join</Text>
                </TouchableOpacity>
            </View>

            {item.description && (
                <Text style={[styles.communityDescription, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>{item.description}</Text>
            )}

            <View style={styles.communityActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="information-circle-outline" size={24} color={colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_ICON} />
                    <Text style={[styles.actionText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>Info</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="people-outline" size={24} color={colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_ICON} />
                    <Text style={[styles.actionText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>{item.membersCount} Members</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Community;