import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const educationEmojis = [
  '😀', '😁', '😂', '🤣', '😃',
  '📝', '✏️', '🖊️', '🖋️', '✒️', '📒', '📔', '📕',
  '📚', '📙', '📘', '📗', '📓', '📖', '📜', '📃',
  '📑', '🔖', '🗂️', '🗃️', '🗄️', '🔍', '🔎', '🔬',
  '🔭', '🧬', '🧫', '🧪', '👩‍🏫', '👩‍🎓', '👩‍🔬',
  '👨‍💻', '👨‍🏫', '🎓', '🏆', '🥇', '🥈', '🥉',
];

export default function EmojiPicker({ handleEmojiSelect }) {
  return (
    <View style={styles.emojiPickerContainer}>
      <FlatList
        data={educationEmojis}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEmojiSelect(item)} style={styles.emojiButton}>
            <Text style={styles.emoji}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.emojiScrollView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emojiPickerContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  emojiScrollView: {
    padding: 10,
  },
  emojiButton: {
    padding: 5,
  },
  emoji: {
    fontSize: 24,
  },
});