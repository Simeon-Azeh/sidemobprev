import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TouchableOpacity, useColorScheme, RefreshControl, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import Header from '../../components/General/Header';
import { useNavigation } from '@react-navigation/native';
import Post from '../../components/IQlink/Post';
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { auth } from '../../../firebaseConfig';
import styles from '../../components/IQlink/styles';
import PostSkeleton from '../../components/IQlink/PostSkeleton';
import { StatusBar } from 'react-native';

export default function IQlink() {
    const [showAllComments, setShowAllComments] = useState({});
    const [replyingToPost, setReplyingToPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [commentLikes, setCommentLikes] = useState({});
    const [postLikes, setPostLikes] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [postsData, setPostsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);

    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const headerHeight = useRef(new Animated.Value(60)).current; // Adjust the initial height as needed

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

    const handleScroll = () => {
        setIsScrolling(true);
        Animated.timing(headerHeight, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
        clearTimeout(handleScroll.timeout);
        handleScroll.timeout = setTimeout(() => {
            setIsScrolling(false);
            Animated.timing(headerHeight, {
                toValue: 60,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }, 3000);
    };

    const renderSkeletons = () => (
        <View>
            {[...Array(3)].map((_, index) => (
                <PostSkeleton key={index} colorScheme={colorScheme} />
            ))}
        </View>
    );

    return (
        <View style={[styles.container, { 
            backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND,
            paddingTop: Platform.OS === 'ios' ? 40 : 0, // Add status bar padding
        }]}>
            <Animated.View style={[
                styles.headerContainer,
                { 
                    height: headerHeight,
                    backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND,
                    transform: [{
                        translateY: headerHeight.interpolate({
                            inputRange: [0, 60],
                            outputRange: [-35, 0],
                        })
                    }]
                }
            ]}>
                <Header />
            </Animated.View>
    
            <FlatList
             contentContainerStyle={{ 
                paddingTop: 70,
                paddingBottom: 20 
            }}
            data={loading ? [] : postsData}
            renderItem={({ item }) => (
                <View style={{ paddingHorizontal: 15 }}>
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
                </View>
            )}
            ListEmptyComponent={loading ? renderSkeletons() : null}
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
                onScrollBeginDrag={handleScroll}
                ListFooterComponent={
                    <View style={styles.footerContainer}>
                        <Ionicons name="sad-outline" size={24} color={colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE} />
                        <Text style={[styles.footerText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>
                            No more posts available right now. Invite friends to share more content.
                        </Text>
                    </View>
                }
            />

            {!isScrolling && (
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
            )}
        </View>
    );
}

