import { terminal as t } from "@/theme/terminal";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  TextStyle,
} from "react-native";
import { TerminalText } from "./TerminalText";

interface TerminalInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  value,
  onChangeText,
  onSend,
  disabled = false,
  placeholder = "ENTER COMMAND...",
}) => {
  const [focused, setFocused] = useState(false);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(cursorOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(cursorOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      );
      anim.start();
      return () => anim.stop();
    } else {
      cursorOpacity.setValue(0);
    }
  }, [focused, cursorOpacity]);

  return (
    <View style={[styles.wrapper, focused && styles.wrapperFocused]}>
      <TerminalText style={styles.prompt}>{">"}</TerminalText>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={t.colors.primaryMuted}
        multiline
        numberOfLines={4}
        maxLength={2000}
        editable={!disabled}
        selectionColor={t.colors.primary}
        cursorColor={t.colors.primary}
      />
      {focused && !value && (
        <Animated.Text style={[styles.fakeCursor, { opacity: cursorOpacity }]}>
          █
        </Animated.Text>
      )}
      <TouchableOpacity
        onPress={onSend}
        disabled={disabled || !value.trim()}
        style={[styles.sendBtn, (disabled || !value.trim()) && styles.sendBtnDisabled]}
        accessibilityLabel="Send message"
      >
        <TerminalText
          style={[
            styles.sendText,
            (disabled || !value.trim()) && styles.sendTextDisabled,
          ]}
        >
          {disabled ? "[WAIT]" : "[SEND]"}
        </TerminalText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    borderColor: t.colors.primaryMuted,
    backgroundColor: t.colors.bgRaised,
    paddingHorizontal: t.spacing.sm,
    paddingVertical: t.spacing.xs,
  },
  wrapperFocused: {
    borderColor: t.colors.primary,
  },
  prompt: {
    color: t.colors.primaryMuted,
    marginRight: t.spacing.xs,
    paddingBottom: 6,
  },
  input: {
    flex: 1,
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primary,
    maxHeight: 96,
    paddingTop: 0,
    paddingBottom: 0,
  },
  fakeCursor: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primary,
    marginBottom: 4,
  },
  sendBtn: {
    paddingLeft: t.spacing.sm,
    paddingBottom: 4,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendText: {
    color: t.colors.primary,
    fontWeight: "700",
  },
  sendTextDisabled: {
    color: t.colors.primaryMuted,
  },
});
