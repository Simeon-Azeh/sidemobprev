import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Modal, ScrollView, Share } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import styles from './styles';
import { auth } from '../../../firebaseConfig';
import { getFirestore, doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';

const Post = ({
    item,
    navigateToProfile,
    toggleLikePost,
    postLikes,
    toggleShowAllComments,
    showAllComments,
    toggleLikeComment,
    commentLikes,
    replyingToPost,
    setReplyingToPost,
    commentText,
    setCommentText,
    colorScheme,
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [replyingToComment, setReplyingToComment] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const user = auth.currentUser;

    // Ensure likes is always an array
    const likes = Array.isArray(item.likes) ? item.likes : [];
    const isLiked = likes.includes(user.uid);
    const likeCount = likes.length;

    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const savedPostRef = doc(getFirestore(), 'SavedPosts', `${user.uid}-${item.id}`);
                const savedPostDoc = await getDoc(savedPostRef);
                if (savedPostDoc.exists()) {
                    setIsSaved(true);
                }
            } catch (error) {
                console.error('Error checking if post is saved:', error);
            }
        };

        checkIfSaved();
    }, [item.id, user.uid]);

    const handleLikePost = () => {
        toggleLikePost(item.id);
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));
            const userData = userDoc.data();

            const newComment = {
                id: `${user.uid}-${Date.now()}`,
                user: userData.firstName,
                profileImageUri: userData.avatar,
                text: replyingToComment ? `@${replyingToComment.user} ${commentText}` : commentText,
                likes: [],
            };

            // Optimistically update the UI
            const updatedComments = Array.isArray(item.comments) ? [...item.comments, newComment] : [newComment];
            item.comments = updatedComments;
            setCommentText('');
            setReplyingToComment(null);

            const postRef = doc(getFirestore(), 'posts', item.id);
            await updateDoc(postRef, {
                comments: arrayUnion(newComment)
            });
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleSavePost = async () => {
        try {
            const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));
            const userData = userDoc.data();

            const savedPost = {
                postId: item.id,
                userId: user.uid,
                userName: userData.firstName,
                userAvatar: userData.avatar,
                postContent: item,
            };

            const savedPostRef = doc(getFirestore(), 'SavedPosts', `${user.uid}-${item.id}`);
            await setDoc(savedPostRef, savedPost);
            setIsSaved(true);
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    const handleSharePost = async () => {
        try {
            await Share.share({
                message: `Check out this post on Sidec! \n\n${item.description}\n\nJoin Sidec today at https://www.sidecedu.com`,
                title: 'Post on Sidec',
            });
        } catch (error) {
            alert(error.message);
        }
    };

    // Ensure comments is always an array
    const comments = Array.isArray(item.comments) ? item.comments : [];

    return (
        <View style={[
            styles.postCard,
            {
                backgroundColor: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_SECONDARY,
                borderColor: colorScheme === 'light' ? Colors.GRAY : Colors.DARK_BORDER,
                borderWidth: 1,
            }
        ]}>
            <View style={styles.postHeader}>
                <TouchableOpacity onPress={() => navigateToProfile(item.user)}>
                    <Image source={{ uri: item.user.profileImageUri }} style={styles.profileImage} />
                </TouchableOpacity>
                <View style={styles.postInfo}>
                    <TouchableOpacity onPress={() => navigateToProfile(item.user)}>
                        <View style={styles.userNameContainer}>
                            <Text style={[styles.userName, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>{item.user.name}</Text>
                            {item.user.isVerified && (
                                <Ionicons name="checkmark-circle" size={16} color={colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE} style={styles.verifiedIcon} />
                            )}
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.postTime, { color: colorScheme === 'light' ? Colors.GRAY : Colors.DARK_TEXT_MUTED }]}>{item.time}</Text>
                </View>
                <TouchableOpacity onPress={handleSavePost}>
                    <Ionicons
                        name={isSaved ? "bookmark" : "bookmark-outline"}
                        size={24}
                        color={isSaved ? Colors.PRIMARY : colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE}
                    />
                </TouchableOpacity>
            </View>

            {item.contentType === 'image' && (
                <Image source={{ uri: item.contentUri }} style={styles.postImage} />
            )}
            {item.contentType === 'document' && (
                <TouchableOpacity style={styles.documentContainer}>
                    <Feather name="file" size={24} color={Colors.PRIMARY} />
                    <Text style={styles.documentText}>View Document</Text>
                </TouchableOpacity>
            )}
            {item.contentType === 'link' && (
                <TouchableOpacity style={styles.linkContainer}>
                    <Feather name="link" size={24} color={Colors.PRIMARY} />
                    <Text style={styles.linkText}>{item.contentUri}</Text>
                </TouchableOpacity>
            )}

            <Text style={[styles.postDescription, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>{item.description}</Text>

            <View style={styles.postActions}>
                <TouchableOpacity onPress={handleLikePost} style={styles.actionButton}>
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={24}
                        color={isLiked ? Colors.PRIMARY : colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE}
                    />
                    <Text style={[styles.actionText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>{likeCount} Likes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setReplyingToPost(item.id === replyingToPost ? null : item.id)}
                >
                    <Ionicons name="chatbubble-outline" size={24} color={colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE} />
                    <Text style={[styles.actionText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>{comments.length} Comments</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleSharePost}>
                    <Ionicons name="share-outline" size={24} color={colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE} />
                    <Text style={[styles.actionText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Share</Text>
                </TouchableOpacity>
            </View>

            {comments.length > 0 && (
                <View style={[styles.commentsContainer, { borderTopColor: colorScheme === 'light' ? Colors.GRAY : Colors.DARK_BORDER, borderTopWidth: 1 }]}>
                    {comments.slice(0, showAllComments[item.id] ? comments.length : 2).map(comment => (
                        <View key={comment.id} style={[styles.commentCard, { backgroundColor: colorScheme === 'light' ? Colors.LIGHT_GRAY : Colors.DARK_SECONDARY }]}>
                            <Image source={{ uri: comment.profileImageUri }} style={styles.commentProfileImage} />
                            <View style={styles.commentContent}>
                                <Text style={[styles.commentUser, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>{comment.user}</Text>
                                <Text style={[styles.commentText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT_MUTED }]}>{comment.text}</Text>
                                <View style={styles.commentActions}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setReplyingToComment(comment);
                                            setReplyingToPost(item.id);
                                        }}
                                    >
                                        <Text style={[styles.commentActionText, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE }]}>Reply</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                    {comments.length > 2 && !showAllComments[item.id] && (
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Text style={[styles.showMoreText, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE }]}>Show more comments</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {replyingToPost === item.id && (
                <View style={styles.commentInputContainer}>
                    {replyingToComment && (
                        <Text style={[styles.replyingToText, { color: Colors.PRIMARY }]}>
                            Replying to @{replyingToComment.user}
                        </Text>
                    )}
                    <TextInput
                        style={[styles.commentInput, { backgroundColor: colorScheme === 'light' ? Colors.LIGHT_GRAY : Colors.DARK_SECONDARY, color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}
                        placeholder="Add a comment..."
                        placeholderTextColor={colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT_MUTED}
                        value={commentText}
                        onChangeText={setCommentText}
                    />
                    <TouchableOpacity onPress={handleAddComment}>
                        <Ionicons name="send" size={24} color={colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE} />
                    </TouchableOpacity>
                </View>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={colorScheme === 'light' ? styles.modalContent : styles.modalContentDark}>
                        <ScrollView style={styles.scrollContainer}>
                            {comments.map(comment => (
                                <View key={comment.id} style={[styles.commentCard, { backgroundColor: colorScheme === 'light' ? Colors.LIGHT_GRAY : Colors.DARK_SECONDARY }]}>
                                    <Image source={{ uri: comment.profileImageUri }} style={styles.commentProfileImage} />
                                    <View style={styles.commentContent}>
                                        <Text style={[styles.commentUser, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>{comment.user}</Text>
                                        <Text style={[styles.commentText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT_MUTED }]}>{comment.text}</Text>
                                        <View style={styles.commentActions}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setReplyingToComment(comment);
                                                    setModalVisible(false);
                                                    setReplyingToPost(item.id);
                                                }}
                                            >
                                                <Text style={[styles.commentActionText, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE }]}>Reply</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
                            <Text style={styles.closeModalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Post;