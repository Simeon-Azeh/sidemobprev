import React, { useRef, useEffect } from 'react';
import { View, Animated, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const SkeletonLoader = ({ style }) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
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
    ).start();
  }, [shimmerAnimation]);

  const shimmerBackground = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', '#F2F2F2'], // Change these colors for the shimmer effect
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: shimmerBackground,
          borderRadius: 5,
          width: '100%',
          height: 20,
          marginBottom: 10,
        },
        style,
      ]}
    />
  );
};

export const HomeScreenSkeleton = () => {
  return (
    <View style={{ padding: 15 }}>
      {/* Profile Picture Skeleton */}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <SkeletonLoader
          style={{
            width: screenWidth * 0.15,
            height: screenWidth * 0.15,
            borderRadius: 50,
            marginRight: 10,
          }}
        />
        <View style={{ flex: 1 }}>
          <SkeletonLoader style={{ height: 20, width: '70%' }} />
          <SkeletonLoader style={{ height: 20, width: '50%', marginTop: 5 }} />
        </View>
      </View>
      {/* Enrolled Courses Skeleton */}
      <View>
        <SkeletonLoader style={{ height: 120, width: '100%', borderRadius: 10 }} />
        <SkeletonLoader style={{ height: 120, width: '100%', borderRadius: 10, marginTop: 10 }} />
      </View>
    </View>
  );
};

export default HomeScreenSkeleton;
