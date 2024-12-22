import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';

export default function IQprofile({ route }) {
    const { user } = route.params;

    // Demo posts
    const demoPosts = [
        { id: '1', content: 'This is a demo post. Enjoy!', imageUri: 'https://via.placeholder.com/150' },
        { id: '2', content: 'Another demo post here. Have a look!', imageUri: 'https://via.placeholder.com/150' },
        { id: '3', content: 'Another demo post here. Have a look!', imageUri: 'https://via.placeholder.com/150' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image source={{ uri: user.profileImageUri }} style={styles.profileImage} />
                <Text style={styles.userName}>{user.name}</Text>
                {user.isVerified && (
                    <Ionicons name="checkmark-circle" size={24} color={Colors.PRIMARY} style={styles.verifiedIcon} />
                )}
                <Text style={styles.bio}>{user.bio || "This user doesn't have a bio yet."}</Text>
                <View style={styles.socialLinksContainer}>
                    {user.socialLinks?.map((link, index) => (
                        <TouchableOpacity key={index} style={styles.socialLink}>
                            <Ionicons name="link" size={20} color={Colors.PRIMARY} />
                            <Text style={styles.socialLinkText}>{link}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.statsContainer}>
                    <Text style={styles.statText}>Followers: {user.followers}</Text>
                    <Text style={styles.statText}>Following: {user.following}</Text>
                    <Text style={styles.statText}>Coins: {user.coins}</Text>
                </View>
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Follow</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Message</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.postsContainer}>
                <Text style={styles.sectionTitle}>Posts</Text>
                <FlatList
                    data={demoPosts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.postCard}>
                            {item.imageUri && (
                                <Image source={{ uri: item.imageUri }} style={styles.postImage} />
                            )}
                            <Text style={styles.postContent}>{item.content}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    profileContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    userName: {
        fontSize: 22,
        fontFamily: 'Poppins-Medium',
        color: '#333',
    },
    verifiedIcon: {
        marginLeft: 10,
    },
    bio: {
        fontSize: 16,
        fontFamily: 'Poppins',
        color: '#777',
        textAlign: 'center',
        marginVertical: 10,
    },
    socialLinksContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    socialLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    socialLinkText: {
        fontSize: 16,
        fontFamily: 'Poppins',
        color: Colors.PRIMARY,
        marginLeft: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    statText: {
        fontSize: 16,
        fontFamily: 'Poppins',
        color: '#333',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    actionButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#fff',
    },
    postsContainer: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#333',
        marginBottom: 10,
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        padding: 10,
    },
    postImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    postContent: {
        fontSize: 16,
        fontFamily: 'Poppins',
        color: '#333',
        marginTop: 10,
    },
});
