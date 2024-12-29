import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, useColorScheme, RefreshControl, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import Header from '../../components/General/Header';
import { useNavigation } from '@react-navigation/native';
import Post from '../../components/IQlink/Post';
import Community from '../../components/IQlink/Community';
import Tabs from '../../components/IQlink/Tabs';
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { auth } from '../../../firebaseConfig';
import styles from '../../components/IQlink/styles';

const communitiesData = [
    {
        id: '1',
        name: 'Web developers',
        description: 'This is an official community of developers ran by Sidec.',
        membersCount: 123,
        isVerified: true,
        admin: {
            profileImageUri: 'https://img.freepik.com/free-photo/development-opportunity-strategy-improvement-word_53876-13771.jpg?t=st=1723642342~exp=1723645942~hmac=468d9bc19ceb11dc541502146374f9b21ec3c4e0a58b69aa782b2ae24916219f&w=740',
            name: 'Sidec Admin',
        },
    },
    // Add more community objects here
];

export default function IQlink() {
    const [selectedTab, setSelectedTab] = useState('Feeds');
    const [showAllComments, setShowAllComments] = useState({});
    const [replyingToPost, setReplyingToPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [commentLikes, setCommentLikes] = useState({});
    const [postLikes, setPostLikes] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [postsData, setPostsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();
    const colorScheme = useColorScheme();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const querySnapshot = await getDocs(collection(getFirestore(), 'posts'));
            let posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            posts = shuffleArray(posts); // Shuffle the posts array
            setPostsData(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const toggleShowAllComments = (postId) => {
        setShowAllComments((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
    };

    const navigateToProfile = (user) => {
        navigation.navigate('IQprofile', { user });
    };

    const toggleLikePost = async (postId) => {
        const user = auth.currentUser;
        if (!user) return;

        const postRef = doc(getFirestore(), 'posts', postId);
        const post = postsData.find(post => post.id === postId);
        const likes = Array.isArray(post.likes) ? post.likes : [];
        const isLiked = likes.includes(user.uid);

        // Optimistically update the UI
        const updatedPostsData = postsData.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likes: isLiked ? likes.filter(uid => uid !== user.uid) : [...likes, user.uid]
                };
            }
            return post;
        });
        setPostsData(updatedPostsData);

        try {
            if (isLiked) {
                await updateDoc(postRef, {
                    likes: arrayRemove(user.uid)
                });
            } else {
                await updateDoc(postRef, {
                    likes: arrayUnion(user.uid)
                });
            }
        } catch (error) {
            console.error('Error updating like status:', error);
            // Revert the optimistic update if the Firestore update fails
            setPostsData(postsData);
        }
    };

    const toggleLikeComment = async (postId, commentId) => {
        const user = auth.currentUser;
        if (!user) return;

        const postRef = doc(getFirestore(), 'posts', postId);
        const post = postsData.find(post => post.id === postId);
        const comments = Array.isArray(post.comments) ? post.comments : [];
        const comment = comments.find(comment => comment.id === commentId);
        const likes = Array.isArray(comment.likes) ? comment.likes : [];
        const isLiked = likes.includes(user.uid);

        // Optimistically update the UI
        const updatedPostsData = postsData.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: comments.map(comment => {
                        if (comment.id === commentId) {
                            return {
                                ...comment,
                                likes: isLiked ? likes.filter(uid => uid !== user.uid) : [...likes, user.uid]
                            };
                        }
                        return comment;
                    })
                };
            }
            return post;
        });
        setPostsData(updatedPostsData);

        try {
            if (isLiked) {
                await updateDoc(postRef, {
                    [`comments.${commentId}.likes`]: arrayRemove(user.uid)
                });
            } else {
                await updateDoc(postRef, {
                    [`comments.${commentId}.likes`]: arrayUnion(user.uid)
                });
            }
        } catch (error) {
            console.error('Error updating like status:', error);
            // Revert the optimistic update if the Firestore update fails
            setPostsData(postsData);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchPosts().then(() => setRefreshing(false));
    };

    const formatPostTime = (time) => {
        return formatDistanceToNow(new Date(time), { addSuffix: true });
    };

    return (
        <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }]}>
            <Header />
            <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} colorScheme={colorScheme} />

            {selectedTab === 'Feeds' && (
                <FlatList
                    data={postsData}
                    renderItem={({ item }) => (
                        <Post
                            item={{ ...item, time: formatPostTime(item.time) }}
                            navigateToProfile={navigateToProfile}
                            toggleLikePost={toggleLikePost}
                            postLikes={postLikes}
                            toggleShowAllComments={toggleShowAllComments}
                            showAllComments={showAllComments}
                            toggleLikeComment={toggleLikeComment}
                            commentLikes={commentLikes}
                            replyingToPost={replyingToPost}
                            setReplyingToPost={setReplyingToPost}
                            commentText={commentText}
                            setCommentText={setCommentText}
                            colorScheme={colorScheme}
                        />
                    )}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    style={styles.postsList}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[Colors.PRIMARY]}
                            tintColor={Colors.PRIMARY}
                        />
                    }
                    ListEmptyComponent={
                        !loading && (
                            <View style={styles.emptyContainer}>
                                <Text style={[styles.emptyText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>
                                    No posts yet available.
                                </Text>
                            </View>
                        )
                    }
                    ListFooterComponent={
                        postsData.length > 0 && (
                            <View style={styles.footerContainer}>
                                <Text style={[styles.footerText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>
                                    No more posts available right now. Invite friends to share more content.
                                </Text>
                            </View>
                        )
                    }
                />
            )}
            {selectedTab === 'Communities' && (
                <FlatList
                    data={communitiesData}
                    renderItem={({ item }) => (
                        <Community
                            item={item}
                            navigateToProfile={navigateToProfile}
                            colorScheme={colorScheme}
                        />
                    )}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    style={styles.postsList}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[Colors.PRIMARY]}
                            tintColor={Colors.PRIMARY}
                        />
                    }
                />
            )}

            <TouchableOpacity
                style={[
                    styles.fab,
                    { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE },
                ]}
                onPress={() => navigation.navigate('UploadPost')}
            >
                <Ionicons
                    name="add"
                    size={32}
                    color={colorScheme === 'light' ? '#fff' : '#000'}
                />
            </TouchableOpacity>
        </View>
    );
}