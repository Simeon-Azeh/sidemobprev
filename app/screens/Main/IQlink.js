import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import Header from '../../components/General/Header';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

// Sample data for posts with descriptions, comments, verified status, and follow link
const postsData = [
  {
      id: '1',
      user: {
          name: 'John Doe',
          profileImageUri: 'https://img.freepik.com/free-photo/handsome-black-man-standing-blue-wall_1157-29709.jpg',
          isVerified: true,
      },
      time: '2h',
      description: 'How is Ai affecting us? Check next post.',
      contentType: 'image',
      contentUri: 'https://img.freepik.com/free-photo/emotional-african-american-man-using-vr-headset_155003-31003.jpg',
      comments: [
          { id: '1', user: 'Alice', profileImageUri: 'https://img.freepik.com/free-photo/black-woman-wearing-blank-shirt-medium-shot_23-2149345058.jpg?t=st=1723640957~exp=1723644557~hmac=3beeea9378de2431256bfa9b15bf765e2a50881ece3d5845360463dab5773457&w=740', text: 'Great post!' },
          { id: '2', user: 'Bob', profileImageUri: 'https://img.freepik.com/free-photo/handsome-sensitive-man-portrait_23-2149509828.jpg?t=st=1723641050~exp=1723644650~hmac=41d8d737dc2cf3a3b8ad34cf7034ecf748c031450f8d3328635859500701d2c2&w=740', text: 'Nice shot!' },
      ],
  },
  {
      id: '2',
      user: {
          name: 'Jane Smith',
          profileImageUri: 'https://img.freepik.com/free-photo/smiley-african-woman-wearing-traditional-accessories_23-2148747966.jpg?t=st=1723640875~exp=1723644475~hmac=de3361a31b44fdf5d8cdea89562506f7d0afed7ce6a8702c56e7d373d7a4476a&w=740',
          isVerified: false,
      },
      time: '5h',
      description: 'Sharing my recent project documents.',
      contentType: 'document',
      contentUri: 'https://example.com/document.pdf',
      comments: [
          { id: '1', user: 'Charlie', profileImageUri: 'https://img.freepik.com/free-photo/front-view-smiley-handsome-man_23-2148850976.jpg?t=st=1723641098~exp=1723644698~hmac=63c885ae2395af405a7e4c2f2051cd2c8d0a06e3e77850eade54cfb05526f2fb&w=740', text: 'Thanks for sharing!' },
      ],
  },
  {
      id: '3',
      user: {
          name: 'Alex Johnson',
          profileImageUri: 'https://img.freepik.com/free-photo/afro-american-woman-model-studio_1303-13585.jpg?t=st=1723640991~exp=1723644591~hmac=161896483fe346dfc66513043e14e8c5a593cbc2af7b88cd0285846592cbc5e1&w=360',
          isVerified: true,
      },
      time: '1d',
      description: 'Check out this interesting article.',
      contentType: 'link',
      contentUri: 'https://example.com',
      comments: [
          { id: '1', user: 'David', profileImageUri: 'https://img.freepik.com/free-photo/young-african-american-man-wearing-casual-clothes-doing-time-out-gesture-with-hands-frustrated-serious-face_839833-13417.jpg?t=st=1723641151~exp=1723644751~hmac=071f8d11c7867cf51d694b12108de5f21ce319f45a1af2d15690e1526b1ed8ca&w=740', text: 'Interesting article.' },
          { id: '2', user: 'Emma', profileImageUri: 'https://img.freepik.com/free-photo/high-angle-black-man-posing-with-sunglasses_23-2149415774.jpg?t=st=1723641179~exp=1723644779~hmac=f125afa4ede59b1d8de336d4887c8ed8f95a94069aa9e46e0cd8af7be3f45440&w=360', text: 'Very informative!' },
          { id: '3', user: 'David', profileImageUri: 'https://img.freepik.com/free-photo/young-african-american-man-wearing-casual-clothes-doing-time-out-gesture-with-hands-frustrated-serious-face_839833-13417.jpg?t=st=1723641151~exp=1723644751~hmac=071f8d11c7867cf51d694b12108de5f21ce319f45a1af2d15690e1526b1ed8ca&w=740', text: 'Interesting article.' },
          { id: '4', user: 'Emma', profileImageUri: 'https://img.freepik.com/free-photo/high-angle-black-man-posing-with-sunglasses_23-2149415774.jpg?t=st=1723641179~exp=1723644779~hmac=f125afa4ede59b1d8de336d4887c8ed8f95a94069aa9e46e0cd8af7be3f45440&w=360', text: 'Very informative!' },
      ],
  },
];

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
    const [replyingToPost, setReplyingToPost] = useState(null);  // To manage replying state for posts
    const [commentText, setCommentText] = useState('');          // To store comment input text
    const [commentLikes, setCommentLikes] = useState({});        // To store likes for comments
    const [postLikes, setPostLikes] = useState({});              // To store likes for posts

    const navigation = useNavigation();

    const toggleShowAllComments = (postId) => {
        setShowAllComments((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
    };

    const navigateToProfile = (user) => {
        navigation.navigate('IQprofile', { user });
    };

    const toggleLikePost = (postId) => {
        setPostLikes((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
    };

    const toggleLikeComment = (postId, commentId) => {
        setCommentLikes((prevState) => ({
            ...prevState,
            [postId]: {
                ...(prevState[postId] || {}),
                [commentId]: !prevState[postId]?.[commentId],
            },
        }));
    };

    const renderPost = ({ item }) => (
        <View style={styles.postCard}>
            {/* Header with user info */}
            <View style={styles.postHeader}>
                <TouchableOpacity onPress={() => navigateToProfile(item.user)}>
                    <Image source={{ uri: item.user.profileImageUri }} style={styles.profileImage} />
                </TouchableOpacity>
                <View style={styles.postInfo}>
                    <TouchableOpacity onPress={() => navigateToProfile(item.user)}>
                        <View style={styles.userNameContainer}>
                            <Text style={styles.userName}>{item.user.name}</Text>
                            {item.user.isVerified && (
                                <Ionicons name="checkmark-circle" size={16} color={Colors.PRIMARY} style={styles.verifiedIcon} />
                            )}
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.postTime}>{item.time}</Text>
                </View>
                <TouchableOpacity>
                    <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
            </View>

            {/* Post Content */}
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

            {/* Post Description */}
            <Text style={styles.postDescription}>{item.description}</Text>

            {/* Post Actions with like, comment, and share counts */}
            <View style={styles.postActions}>
                <TouchableOpacity onPress={() => toggleLikePost(item.id)} style={styles.actionButton}>
                    <Ionicons
                        name={postLikes[item.id] ? "heart" : "heart-outline"}
                        size={24}
                        color={postLikes[item.id] ? Colors.PRIMARY : "#333"}
                    />
                    <Text style={styles.actionText}>{postLikes[item.id] ? '1' : '0'} Likes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setReplyingToPost(item.id === replyingToPost ? null : item.id)}
                >
                    <Ionicons name="chatbubble-outline" size={24} color="#333" />
                    <Text style={styles.actionText}>{item.comments.length} Comments</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-outline" size={24} color="#333" />
                    <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
            </View>

            {/* Comment Cards */}
            {item.comments.length > 0 && (
                <View style={styles.commentsContainer}>
                    {item.comments.slice(0, showAllComments[item.id] ? item.comments.length : 2).map(comment => (
                        <View key={comment.id} style={styles.commentCard}>
                            <Image source={{ uri: comment.profileImageUri }} style={styles.commentProfileImage} />
                            <View style={styles.commentContent}>
                                <Text style={styles.commentUser}>{comment.user}</Text>
                                <Text style={styles.commentText}>{comment.text}</Text>
                                <View style={styles.commentActions}>
                                    <TouchableOpacity onPress={() => toggleLikeComment(item.id, comment.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons
                                            name={commentLikes[item.id]?.[comment.id] ? "heart" : "heart-outline"}
                                            size={16}
                                            color={commentLikes[item.id]?.[comment.id] ? Colors.PRIMARY : "#333"}
                                        />
                                        <Text style={styles.commentActionText}>Like</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setReplyingToPost(item.id === replyingToPost ? null : item.id)}
                                    >
                                        <Text style={styles.commentActionText}>Reply</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                    {item.comments.length > 2 && !showAllComments[item.id] && (
                        <TouchableOpacity onPress={() => toggleShowAllComments(item.id)}>
                            <Text style={styles.showMoreText}>Show more comments</Text>
                        </TouchableOpacity>
                    )}
                    {showAllComments[item.id] && (
                        <TouchableOpacity onPress={() => toggleShowAllComments(item.id)}>
                            <Text style={styles.showMoreText}>Show less comments</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Comment Input */}
            {replyingToPost === item.id && (
                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment..."
                        value={commentText}
                        onChangeText={setCommentText}
                    />
                    <TouchableOpacity onPress={() => {
                        console.log('Comment:', commentText);
                        setCommentText(''); // Clear the comment text after sending
                    }}>
                        <Ionicons name="send" size={24} color={Colors.PRIMARY} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
    const renderCommunity = ({ item }) => (
      <View style={styles.communityCard}>
          {/* Header with community info */}
          <View style={styles.communityHeader}>
              <TouchableOpacity onPress={() => navigateToProfile(item.admin)}>
                  <Image source={{ uri: item.admin.profileImageUri }} style={styles.profileImage} />
              </TouchableOpacity>
              <View style={styles.communityInfo}>
                  <TouchableOpacity onPress={() => navigateToProfile(item.admin)}>
                      <View style={styles.userNameContainer}>
                          <Text style={styles.userName}>{item.name}</Text>
                          {item.isVerified && (
                              <Ionicons name="checkmark-circle" size={16} color={Colors.PRIMARY} style={styles.verifiedIcon} />
                          )}
                      </View>
                  </TouchableOpacity>
                  <Text style={styles.communityTime}>{item.membersCount} Members</Text>
              </View>
              <TouchableOpacity>
                  <Text style={styles.joinText}>Join</Text>
              </TouchableOpacity>
          </View>
  
          {/* Community Content */}
          {item.description && (
              <Text style={styles.communityDescription}>{item.description}</Text>
          )}
  
          {/* Community Actions with join and info */}
          <View style={styles.communityActions}>
              <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="information-circle-outline" size={24} color="#333" />
                  <Text style={styles.actionText}>Info</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="people-outline" size={24} color="#333" />
                  <Text style={styles.actionText}>{item.membersCount} Members</Text>
              </TouchableOpacity>
          </View>
      </View>
  );
  
    return (
        <View style={styles.container}>
            <Header />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'Feeds' && styles.selectedTabButton]}
                    onPress={() => setSelectedTab('Feeds')}
                >
                    <Text style={styles.tabButtonText}>Feeds</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'Communities' && styles.selectedTabButton]}
                    onPress={() => setSelectedTab('Communities')}
                >
                    <Text style={styles.tabButtonText}>Communities</Text>
                </TouchableOpacity>
            </View>

            {/* Feeds Section */}
            {selectedTab === 'Feeds' && (
                <FlatList
                    data={postsData}
                    renderItem={renderPost}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    style={styles.postsList}
                />
                
            )}
             {selectedTab === 'Communities' && (
    <FlatList
        data={communitiesData} // Replace with your communities data
        renderItem={renderCommunity}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.postsList}
    />
)}



            {/* Floating Action Button (FAB) */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('UploadPost')}>
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    tabButton: {
        paddingVertical: 10,
    },
    selectedTabButton: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.PRIMARY,
    },
    tabButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#333',
    },
    postsList: {
        paddingHorizontal: 20,
        paddingTop: 20,
      
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    postHeader: {
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
    postInfo: {
        flex: 1,
    },
    userNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#333',
    },
    verifiedIcon: {
        marginLeft: 5,
    },
    followText: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: Colors.PRIMARY,
        marginLeft: 10,
    },
    postTime: {
        fontSize: 12,
        fontFamily: 'Poppins',
        color: '#777',
    },
    postImage: {
        width: '100%',
        height: screenWidth * 0.5,
        borderRadius: 10,
        marginBottom: 15,
    },
    documentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 15,
    },
    documentText: {
        marginLeft: 10,
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: Colors.PRIMARY,
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 15,
    },
    linkText: {
        marginLeft: 10,
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: Colors.PRIMARY,
    },
    postDescription: {
        fontSize: 14,
        fontFamily: 'Poppins',
        color: '#555',
        marginBottom: 10,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 5,
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#333',
    },
    commentsContainer: {
        marginTop: 10,
    },
    commentCard: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
       
    },
    commentProfileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    commentUser: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: '#333',
    },
    commentText: {
        fontSize: 13,
        fontFamily: 'Poppins',
        color: '#555',
    },
    commentActions: {
        flexDirection: 'row',
        marginTop: 5,
        gap: 10,

    },
    commentActionText: {
        marginLeft: 5,
        fontSize: 13,
        fontFamily: 'Poppins-Medium',
        color: Colors.PRIMARY,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 5,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    commentInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins',
        color: '#333',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 20,
        marginRight: 10,
    },
    showMoreText: {
        fontFamily: 'Poppins-Medium',
        color: Colors.PRIMARY,
        marginTop: 5,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: Colors.PRIMARY,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },

   
      communityCard: {
          backgroundColor: '#fff',
          borderRadius: 10,
          padding: 15,
          marginBottom: 20,
      },
      communityHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
      },
      communityInfo: {
          flex: 1,
          marginLeft: 10,
      },
      communityDescription: {
          fontSize: 14,
          fontFamily: 'Poppins',
          color: '#555',
          marginBottom: 10,
      },
      communityActions: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
      },
      joinText: {
          fontSize: 14,
          fontFamily: 'Poppins-Medium',
          color: Colors.PRIMARY,
          marginLeft: 10,
      },
      communityTime: {
          fontSize: 12,
          fontFamily: 'Poppins',
          color: '#777',
      },
      communityHeader: {
          flexDirection: 'row',
          alignItems: 'center',
      },
      communityCard: {
          backgroundColor: '#fff',
          borderRadius: 10,
          padding: 15,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
      },
  
  
});
