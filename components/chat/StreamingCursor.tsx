import { terminal as t } from "@/theme/terminal";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const StreamingCursor: React.FC = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.Text
      style={{
        opacity,
        color: t.colors.primary,
        fontFamily: t.fonts.mono,
        fontSize: t.fonts.size.sm,
      }}
    >
      █
    </Animated.Text>
  );
};
