import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors';

const PostSkeleton = ({ colorScheme }) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);

  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.skeletonContainer, {
      backgroundColor: colorScheme === 'light' ? '#fafafa' : Colors.DARK_SECONDARY
    }]}>
      <Animated.View style={[styles.shimmer, {
        transform: [{ translateX: shimmerTranslate }],
      }]} />
      <View style={styles.header}>
        <View style={[styles.avatar, styles.skeleton, {
          backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#2a2a2a'
        }]} />
        <View style={styles.headerText}>
          <View style={[styles.nameSkeleton, styles.skeleton, {
            backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#2a2a2a'
          }]} />
          <View style={[styles.timeSkeleton, styles.skeleton, {
            backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#2a2a2a'
          }]} />
        </View>
      </View>
      <View style={[styles.contentSkeleton, styles.skeleton, {
        backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#2a2a2a'
      }]} />
      <View style={styles.actionsContainer}>
        {[1, 2, 3].map((_, index) => (
          <View
            key={index}
            style={[styles.actionSkeleton, styles.skeleton, {
              backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#2a2a2a'
            }]}
          />
        ))}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  skeletonContainer: {
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '45deg' }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    gap: 8,
  },
  nameSkeleton: {
    height: 15,
    width: '40%',
    borderRadius: 4,
  },
  timeSkeleton: {
    height: 12,
    width: '25%',
    borderRadius: 4,
  },
  contentSkeleton: {
    height: 120,
    borderRadius: 8,
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionSkeleton: {
    height: 20,
    width: 60,
    borderRadius: 4,
  },
  skeleton: {
    opacity: 0.7,
  },
});

export default PostSkeleton;