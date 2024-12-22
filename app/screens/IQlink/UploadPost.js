import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather, Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import Header from '../../components/General/Header';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function UploadPost({ navigation }) {
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [link, setLink] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const pickFile = async () => {
        // Add functionality for file picker here
        // For now, just show an alert
        Alert.alert('File Picker', 'File picker functionality is not implemented yet.');
    };

    const handlePost = () => {
        // Handle the post submission logic here
        console.log('Post description:', description);
        console.log('Selected image:', selectedImage);
        console.log('Link:', link);
        console.log('Selected file:', selectedFile);

        // After submitting the post, navigate back to the Feeds
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
          
            <View style={styles.content}>
                <TextInput
                    style={styles.textInput}
                    placeholder="What's on your mind?"
                    multiline
                    value={description}
                    onChangeText={setDescription}
                />

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={pickImage} style={styles.button}>
                    <MaterialCommunityIcons name="image-plus" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Add Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={pickFile} style={styles.button}>
                    <AntDesign name="addfile" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Add File</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Link', 'Add link functionality here')}>
                    <MaterialIcons name="add-link" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Add Link</Text>
                    </TouchableOpacity>
                </View>

                {selectedImage && (
                    <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                )}

                <TextInput
                    style={styles.textInput}
                    placeholder="Enter link..."
                    value={link}
                    onChangeText={setLink}
                />

                <TouchableOpacity onPress={handlePost} style={styles.postButton}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 20,
    },
    textInput: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins',
        color: '#333',
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#f5f5f5',
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
        backgroundColor: Colors.PRIMARY,
        borderRadius: 5,
        width: '30%',
        justifyContent: 'center',
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
    postButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    postButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#fff',
    },
});
