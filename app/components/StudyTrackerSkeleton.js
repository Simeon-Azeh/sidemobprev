import React, { useRef, useEffect } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');

const SkeletonLoader = ({ style }) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();

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
    outputRange: colorScheme === 'light' ? ['#E0E0E0', '#F2F2F2'] : [Colors.DARK_SECONDARY, Colors.DARK_BACKGROUND],
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

export const StudyTrackerSkeleton = () => {
  return (
    <View style={{ padding: 15 }}>
      {/* Button Skeleton */}
      <SkeletonLoader style={{ height: 50, width: '100%', borderRadius: 5 }} />
      {/* Chart or Task List Skeleton */}
      <View style={{ marginTop: 20 }}>
        <SkeletonLoader style={{ height: 200, width: '100%', borderRadius: 10 }} />
        <SkeletonLoader style={{ height: 200, width: '100%', borderRadius: 10, marginTop: 10 }} />
      </View>
    </View>
  );
};

export default StudyTrackerSkeleton;