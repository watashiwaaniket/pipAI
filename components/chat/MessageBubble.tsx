import { StreamingCursor } from "@/components/chat/StreamingCursor";
import { terminal as t } from "@/theme/terminal";
import { Message } from "@/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MessageBubbleProps {
  message: Message;
}

const TAG_COLORS: Record<string, string> = {
  "[CRITICAL]": t.colors.danger,
  "[WARNING]": t.colors.warning,
  "[NOTE]": "#00AAFF",
};

function renderContent(content: string, baseColor: string) {
  const parts: React.ReactNode[] = [];
  let remaining = content;
  let key = 0;

  while (remaining.length > 0) {
    let firstTagIdx = Infinity;
    let firstTag = "";
    for (const tag of Object.keys(TAG_COLORS)) {
      const idx = remaining.indexOf(tag);
      if (idx !== -1 && idx < firstTagIdx) {
        firstTagIdx = idx;
        firstTag = tag;
      }
    }

    if (firstTagIdx === Infinity) {
      parts.push(
        <Text key={key++} style={{ color: baseColor }}>
          {remaining}
        </Text>,
      );
      break;
    }

    if (firstTagIdx > 0) {
      parts.push(
        <Text key={key++} style={{ color: baseColor }}>
          {remaining.slice(0, firstTagIdx)}
        </Text>,
      );
    }

    parts.push(
      <Text
        key={key++}
        style={{ color: TAG_COLORS[firstTag], fontWeight: "700" }}
      >
        {firstTag}
      </Text>,
    );

    remaining = remaining.slice(firstTagIdx + firstTag.length);
  }

  return parts;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isUser) {
    return (
      <View style={styles.userWrapper}>
        <Text style={styles.roleLabel}>[YOU]</Text>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.content}</Text>
        </View>
        <Text style={styles.timestamp}>{time}</Text>
      </View>
    );
  }

  if (isAssistant) {
    return (
      <View style={styles.aiWrapper}>
        <Text style={styles.roleLabel}>[PIP-AI]</Text>
        <View style={styles.aiBubble}>
          <Text style={styles.aiPrompt}>{">"} </Text>
          <Text style={styles.aiText}>
            {renderContent(message.content, t.colors.primary)}
            {message.isGenerating && <StreamingCursor />}
          </Text>
        </View>
        <Text style={styles.timestamp}>{time}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  userWrapper: {
    alignItems: "flex-end",
    marginBottom: t.spacing.md,
    paddingLeft: 48,
  },
  aiWrapper: {
    alignItems: "flex-start",
    marginBottom: t.spacing.md,
    paddingRight: 48,
  },
  roleLabel: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.primaryMuted,
    marginBottom: t.spacing.xs,
    letterSpacing: 1,
  },
  userBubble: {
    backgroundColor: t.colors.bgRaised,
    borderWidth: 1,
    borderColor: t.colors.primaryMuted,
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.sm,
  },
  userText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primaryDim,
    lineHeight: t.fonts.size.sm * t.fonts.lineHeight.normal,
  },
  aiBubble: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: t.colors.bgRaised,
    borderWidth: 1,
    borderColor: t.colors.primaryMuted,
    borderLeftWidth: 2,
    borderLeftColor: t.colors.primary,
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.sm,
  },
  aiPrompt: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primaryMuted,
    marginTop: 1,
  },
  aiText: {
    flex: 1,
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primary,
    lineHeight: t.fonts.size.sm * t.fonts.lineHeight.normal,
    flexWrap: "wrap",
  },
  timestamp: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.textMuted,
    marginTop: t.spacing.xs,
  },
});
