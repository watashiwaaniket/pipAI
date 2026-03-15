import { ScanlineOverlay } from "@/components/terminal/ScanlineOverlay";
import { PipStatusBar } from "@/components/terminal/StatusBar";
import { AVAILABLE_MODELS } from "@/constants/models";
import { useAppStore } from "@/stores/appStore";
import { useChatStore } from "@/stores/chatStore";
import { terminal as t } from "@/theme/terminal";
import { Chat } from "@/types";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function IntelScreen() {
  const insets = useSafeAreaInsets();
  const allChats = useChatStore((s) => s.chats);
  const chats = useMemo(() => 
    [...allChats].sort((a, b) => b.updatedAt - a.updatedAt),
  [allChats]);
  
  const deleteChat = useChatStore((s) => s.deleteChat);
  const activeModelId = useAppStore((s) => s.activeModelId);
  const router = useRouter();

  const activeModel = activeModelId
    ? AVAILABLE_MODELS.find((m) => m.id === activeModelId)
    : null;

  const handleNew = () => {
    if (!activeModelId) {
      Alert.alert("NO MODEL LOADED", "Navigate to CONFIG to download and activate a model.");
      return;
    }
    const chat = useChatStore.getState().createChat(activeModelId);
    router.push(`/chat/${chat.id}`);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "DELETE MISSION LOG",
      `> PURGE: "${title}"?`,
      [
        { text: "[N] Cancel", style: "cancel" },
        {
          text: "[Y] Delete",
          style: "destructive",
          onPress: () => deleteChat(id),
        },
      ],
    );
  };

  const renderChat = ({ item }: { item: Chat }) => {
    const date = new Date(item.updatedAt).toLocaleDateString();
    const time = new Date(item.updatedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const model = AVAILABLE_MODELS.find((m) => m.id === item.modelId);

    return (
      <TouchableOpacity
        style={styles.chatRow}
        onPress={() => router.push(`/chat/${item.id}`)}
        onLongPress={() => handleDelete(item.id, item.title)}
      >
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle} numberOfLines={1}>
            {">"} {item.title.toUpperCase()}
          </Text>
          <Text style={styles.chatTime}>{date} {time}</Text>
        </View>
        <Text style={styles.chatMeta}>
          {model?.name ?? item.modelId} | {item.messages.length} MSG
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScanlineOverlay />
      <PipStatusBar title="INTEL" modelName={activeModel?.name} />

      <View style={styles.header}>
        <Text style={styles.headerText}>╔══ INTEL ARCHIVE ══╗</Text>
        {!activeModelId && (
          <Text style={styles.warn}>
            {">"} WARNING: NO MODEL ACTIVE — GO TO CONFIG
          </Text>
        )}
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChat}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {">"} NO PRIOR MISSIONS LOGGED
            </Text>
            <Text style={styles.emptyHint}>
              Tap [NEW MISSION] to begin.
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.newBtn} onPress={handleNew}>
        <Text style={styles.newBtnText}>[ NEW MISSION ]</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  header: {
    padding: t.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.primaryMuted,
  },
  headerText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.lg,
    color: t.colors.primary,
  },
  warn: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.warning,
    marginTop: t.spacing.xs,
  },
  list: {
    padding: t.spacing.md,
    flexGrow: 1,
  },
  chatRow: {
    borderWidth: 1,
    borderColor: t.colors.primaryMuted,
    backgroundColor: t.colors.bgRaised,
    padding: t.spacing.md,
    marginBottom: t.spacing.sm,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: t.spacing.xs,
  },
  chatTitle: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primary,
    fontWeight: "700",
    flex: 1,
    marginRight: t.spacing.sm,
  },
  chatTime: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.textMuted,
  },
  chatMeta: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.textMuted,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.md,
    color: t.colors.primaryMuted,
    marginBottom: t.spacing.sm,
  },
  emptyHint: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.textMuted,
  },
  newBtn: {
    margin: t.spacing.md,
    borderWidth: 2,
    borderColor: t.colors.primary,
    padding: t.spacing.md,
    alignItems: "center",
    backgroundColor: t.colors.bgRaised,
  },
  newBtnText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.md,
    color: t.colors.primary,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
