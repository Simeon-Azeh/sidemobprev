import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Feather, Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import Header from '../../components/General/Header';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useColorScheme } from 'react-native';
import { auth } from '../../../firebaseConfig';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function UploadPost({ navigation }) {
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [link, setLink] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [userProfile, setUserProfile] = useState({ firstName: '', avatar: '' });
    const colorScheme = useColorScheme();

    const themeBackgroundColor = colorScheme === 'light' ? Colors.LIGHT_GRAY : Colors.DARK_BACKGROUND;
    const themeTextColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE;
    const themeCardBackgroundColor = colorScheme === 'light' ? Colors.WHITE : Colors.DARK_SECONDARY;
    const themeInputBackgroundColor = colorScheme === 'light' ? Colors.LIGHT_GRAY : Colors.DARK_SECONDARY;
    const themeBorderColor = colorScheme === 'light' ? Colors.GRAY : Colors.DARK_BORDER;
    const themeButtonBackgroundColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON;
    const themeButtonBorderColor = colorScheme === 'light' ? 'transparent' : Colors.DARK_BORDER;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserProfile({
                            firstName: userData.firstName,
                            avatar: userData.avatar,
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setSelectedFile(null);
            setLink('');
        }
    };

    const pickFile = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true,
        });

        if (result.type === 'success') {
            setSelectedFile(result.uri);
            setSelectedImage(null);
            setLink('');
        }
    };

    const uploadToStorage = async (uri, path) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storage = getStorage();
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
    };

    const handlePost = async () => {
        setUploading(true);
        try {
            const user = auth.currentUser;
            if (user) {
                let contentUri = '';
                if (selectedImage) {
                    contentUri = await uploadToStorage(selectedImage, `images/${user.uid}/${Date.now()}`);
                } else if (selectedFile) {
                    contentUri = await uploadToStorage(selectedFile, `files/${user.uid}/${Date.now()}`);
                } else if (link) {
                    contentUri = link;
                }

                const postData = {
                    user: {
                        name: userProfile.firstName,
                        profileImageUri: userProfile.avatar,
                        isVerified: true, // Assuming all users are verified for this example
                    },
                    time: new Date().toISOString(),
                    description,
                    contentType: selectedImage ? 'image' : selectedFile ? 'document' : link ? 'link' : 'text',
                    contentUri,
                    comments: [],
                };

                const docRef = await addDoc(collection(getFirestore(), 'posts'), postData);
                console.log('Document written with ID: ', docRef.id);

                // After submitting the post, navigate back to the Feeds
                navigation.goBack();
            } else {
                Alert.alert('Error', 'You must be logged in to post.');
            }
        } catch (error) {
            console.error('Error adding document: ', error);
            Alert.alert('Error', 'There was an error posting your content. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: themeBackgroundColor }]}>
            <Header />
            <View style={[styles.content, { backgroundColor: themeCardBackgroundColor }]}>
                <TextInput
                    style={[styles.textInput, { backgroundColor: themeInputBackgroundColor, color: themeTextColor, borderColor: themeBorderColor }]}
                    placeholder="What's on your mind?"
                    placeholderTextColor={themeTextColor}
                    multiline
                    value={description}
                    onChangeText={setDescription}
                />

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={pickImage} style={[styles.button, { backgroundColor: themeButtonBackgroundColor, borderColor: themeButtonBorderColor }]}>
                        <MaterialCommunityIcons name="image-plus" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Add Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={pickFile} style={[styles.button, { backgroundColor: themeButtonBackgroundColor, borderColor: themeButtonBorderColor }]}>
                        <AntDesign name="addfile" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Add File</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { backgroundColor: themeButtonBackgroundColor, borderColor: themeButtonBorderColor }]} onPress={() => setLink('')}>
                        <MaterialIcons name="add-link" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Add Link</Text>
                    </TouchableOpacity>
                </View>

                {selectedImage && (
                    <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                )}

                {selectedFile && (
                    <View style={styles.filePreview}>
                        <Text style={{ color: themeTextColor }}>{selectedFile.split('/').pop()}</Text>
                    </View>
                )}

                <TextInput
                    style={[styles.textInput, { backgroundColor: themeInputBackgroundColor, color: themeTextColor, borderColor: themeBorderColor }]}
                    placeholder="Enter link..."
                    placeholderTextColor={themeTextColor}
                    value={link}
                    onChangeText={setLink}
                />

                <TouchableOpacity onPress={handlePost} style={[styles.postButton, { backgroundColor: themeButtonBackgroundColor, borderColor: themeButtonBorderColor }]}>
                    {uploading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.postButtonText}>Post</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={[styles.previewContainer, { backgroundColor: themeCardBackgroundColor }]}>
                <Text style={[styles.previewTitle, { color: themeTextColor }]}>Post Preview</Text>
                <View style={styles.previewHeader}>
                    {userProfile.avatar ? (
                        <Image source={{ uri: userProfile.avatar }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.profileImagePlaceholder}>
                            <Ionicons name="person-circle-outline" size={40} color={themeTextColor} />
                        </View>
                    )}
                    <Text style={[styles.userName, { color: themeTextColor }]}>{userProfile.firstName}</Text>
                </View>
                <Text style={[styles.previewDescription, { color: themeTextColor }]}>{description}</Text>
                {selectedImage && (
                    <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                )}
                {selectedFile && (
                    <View style={styles.filePreview}>
                        <Text style={{ color: themeTextColor }}>{selectedFile.split('/').pop()}</Text>
                    </View>
                )}
                {link && (
                    <Text style={[styles.previewLink, { color: themeTextColor }]}>{link}</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
        marginHorizontal: 10,
    },
    textInput: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins',
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '30%',
        justifyContent: 'center',
        borderWidth: 1,
    },
    buttonText: {
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins-Medium',
        color: '#fff',
        marginLeft: 10,
    },
    selectedImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    filePreview: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 20,
    },
    postButton: {
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        borderWidth: 1,
    },
    postButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#fff',
    },
    previewContainer: {
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
        marginHorizontal: 10,
    },
    previewTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    profileImagePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    previewDescription: {
        fontSize: 16,
        fontFamily: 'Poppins',
        marginBottom: 10,
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    previewLink: {
        fontSize: 16,
        fontFamily: 'Poppins',
        marginBottom: 10,
    },
});