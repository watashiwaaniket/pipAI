import { ContextMeter } from "@/components/chat/ContextMeter";
import { MessageList } from "@/components/chat/MessageList";
import { ScanlineOverlay } from "@/components/terminal/ScanlineOverlay";
import { TerminalInput } from "@/components/terminal/TerminalInput";
import { useChat } from "@/hooks/useChat";
import { useAppStore } from "@/stores/appStore";
import { terminal as t } from "@/theme/terminal";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [input, setInput] = useState("");
  const { chat, isGenerating, sendMessage, activeModel } = useChat(id);
  const maxTokens = useAppStore((s) => s.settings.maxContextTokens);

  if (!chat) {
    return (
      <View style={[styles.notFound, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Text style={styles.notFoundText}>{">"} MISSION LOG NOT FOUND</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>{"< [BACK]"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tokenCount = chat.messages.reduce(
    (sum, m) => sum + Math.ceil(m.content.length / 4),
    0,
  );

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isGenerating || !activeModel) return;
    setInput("");
    await sendMessage(id, text, activeModel.family);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <ScanlineOverlay />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>{"<"}</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.chatTitle} numberOfLines={1}>
            {chat.title.toUpperCase()}
          </Text>
          {activeModel && (
            <Text style={styles.modelLabel}>{activeModel.name}</Text>
          )}
        </View>
        <ContextMeter used={tokenCount} max={maxTokens} />
      </View>

      <MessageList messages={chat.messages} />

      <View style={styles.inputWrapper}>
        <TerminalInput
          value={input}
          onChangeText={setInput}
          onSend={handleSend}
          disabled={isGenerating || !activeModel}
          placeholder={
            !activeModel ? "NO MODEL ACTIVE..." : "ENTER COMMAND..."
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.primaryMuted,
    backgroundColor: t.colors.bgRaised,
  },
  backBtn: {
    marginRight: t.spacing.sm,
    padding: t.spacing.xs,
  },
  backIcon: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.md,
    color: t.colors.primaryMuted,
    fontWeight: "700",
  },
  headerCenter: {
    flex: 1,
    marginRight: t.spacing.sm,
  },
  chatTitle: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primary,
    fontWeight: "700",
  },
  modelLabel: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.textMuted,
  },
  inputWrapper: {
    paddingHorizontal: t.spacing.md,
    paddingBottom: t.spacing.md,
    paddingTop: t.spacing.sm,
    backgroundColor: t.colors.bg,
  },
  notFound: {
    flex: 1,
    backgroundColor: t.colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.md,
    color: t.colors.danger,
    marginBottom: t.spacing.md,
  },
  backText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primaryMuted,
  },
});
