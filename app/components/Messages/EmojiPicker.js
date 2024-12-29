import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../../assets/Utils/Colors';

const educationEmojis = [
  '😀', '😁', '😂', '🤣', '😃',
  '📝', '✏️', '🖊️', '🖋️', '✒️', '📒', '📔', '📕',
  '📚', '📙', '📘', '📗', '📓', '📖', '📜', '📃',
  '📑', '🔖', '🗂️', '🗃️', '🗄️', '🔍', '🔎', '🔬',
  '🔭', '🧬', '🧫', '🧪', '👩‍🏫', '👩‍🎓', '👩‍🔬',
  '👨‍💻', '👨‍🏫', '🎓', '🏆', '🥇', '🥈', '🥉',
];

export default function EmojiPicker({ handleEmojiSelect }) {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.emojiPickerContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND, borderTopColor: colorScheme === 'light' ? '#ddd' : Colors.DARK_SECONDARY }]}>
      <FlatList
        data={educationEmojis}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEmojiSelect(item)} style={styles.emojiButton}>
            <Text style={[styles.emoji, { color: colorScheme === 'light' ? '#000' : '#fff' }]}>{item}</Text>
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
    borderTopWidth: 1,
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