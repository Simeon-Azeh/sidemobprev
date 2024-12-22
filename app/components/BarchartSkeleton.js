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

export const BarChartSkeleton = () => {
  return (
    <View style={{ padding: 15 }}>
      {/* Chart Skeleton */}
      <SkeletonLoader style={{ height: 240, width: '100%', borderRadius: 10 }} />
      {/* Picker Skeleton */}
      <SkeletonLoader style={{ height: 50, width: '100%', borderRadius: 5, marginTop: 20 }} />
    </View>
  );
};

export default BarChartSkeleton;