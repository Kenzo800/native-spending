import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  animated = true,
}: SkeletonProps) {
  const { colors, isDark } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [animated, animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isDark ? '#333333' : '#e0e0e0',
      isDark ? '#444444' : '#f0f0f0',
    ],
  });

  const skeletonStyle = {
    width,
    height,
    borderRadius,
    backgroundColor: animated ? backgroundColor : (isDark ? '#333333' : '#e0e0e0'),
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        skeletonStyle as any, // Type cast to fix animation compatibility
        style,
      ]}
    />
  );
}

interface SkeletonCardProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function SkeletonCard({ style, children }: SkeletonCardProps) {
  const { colors } = useTheme();
  
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

interface SkeletonListItemProps {
  showAvatar?: boolean;
  showSubtitle?: boolean;
  showAction?: boolean;
}

export function SkeletonListItem({ 
  showAvatar = false, 
  showSubtitle = true, 
  showAction = false 
}: SkeletonListItemProps) {
  return (
    <View style={styles.listItem}>
      {showAvatar && (
        <Skeleton width={40} height={40} borderRadius={20} style={styles.avatar} />
      )}
      <View style={styles.listContent}>
        <Skeleton width="60%" height={16} style={styles.title} />
        {showSubtitle && (
          <Skeleton width="40%" height={12} style={styles.subtitle} />
        )}
      </View>
      {showAction && (
        <Skeleton width={60} height={20} style={styles.action} />
      )}
    </View>
  );
}

interface SkeletonChartProps {
  height?: number;
}

export function SkeletonChart({ height = 200 }: SkeletonChartProps) {
  return (
    <View style={[styles.chart, { height }]}>
      <Skeleton width="100%" height="100%" borderRadius={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    // Base skeleton styles handled by component props
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 0,
  },
  action: {
    marginLeft: 12,
  },
  chart: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
