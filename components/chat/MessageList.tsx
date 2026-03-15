import { terminal as t } from "@/theme/terminal";
import { Message } from "@/types";
import React, { useEffect, useRef } from "react";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [messages.length]);

  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MessageBubble message={item} />}
      contentContainerStyle={styles.content}
      removeClippedSubviews={Platform.OS === "android"}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<View style={styles.footer} />}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: t.spacing.md,
    paddingTop: t.spacing.md,
  },
  footer: { height: t.spacing.md },
});
