import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";

const { height } = Dimensions.get("window");
const LINE_HEIGHT = 4;
const LINE_COUNT = Math.ceil(height / LINE_HEIGHT);

export const ScanlineOverlay = () => {
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateY = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-LINE_HEIGHT * 2, LINE_HEIGHT * 2],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { transform: [{ translateY }] }]}
    >
      {Array.from({ length: LINE_COUNT }).map((_, i) => (
        <View
          key={i}
          style={{
            height: LINE_HEIGHT,
            backgroundColor: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.12)", // every other line darkened
          }}
        />
      ))}
    </Animated.View>
  );
};
