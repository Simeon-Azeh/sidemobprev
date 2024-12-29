import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');

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
        padding: 20,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    communityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
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
    footerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    footerText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        padding: 20,
    },
    modalContentDark: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.DARK_SECONDARY,
        borderRadius: 10,
        padding: 20,
    },
    closeModalButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    closeModalButtonText: {
        color: Colors.PRIMARY,
        fontSize: 16,
    },
    replyingToText: {
        marginBottom: 5,
        fontSize: 12,
        fontFamily: 'Poppins',
    },
    scrollContainer: {
        flex: 1,
    },
});

export default styles;