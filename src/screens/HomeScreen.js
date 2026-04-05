import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Avatar from '../components/Avatar';

const HomeScreen = () => {
  const [currentEmotion, setCurrentEmotion] = useState('happy');

  const emotions = [
    { name: 'happy', label: '😊 Happy', color: '#FFD93D' },
    { name: 'sad', label: '😢 Sad', color: '#6C5CE7' },
    { name: 'surprised', label: '😮 Surprised', color: '#FF6B6B' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Looi Robo</Text>
      <Text style={styles.subtitle}>Animated Avatar MVP</Text>

      <View style={styles.avatarContainer}>
        <Avatar emotion={currentEmotion} size={300} />
      </View>

      <View style={styles.emotionButtons}>
        {emotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.name}
            style={[
              styles.button,
              {
                backgroundColor: emotion.color,
                borderWidth: currentEmotion === emotion.name ? 3 : 0,
                borderColor: '#000',
              },
            ]}
            onPress={() => setCurrentEmotion(emotion.name)}
          >
            <Text style={styles.buttonText}>{emotion.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>MVP Features</Text>
        <Text style={styles.infoText}>✓ 3 Animated Expressions (Happy, Sad, Surprised)</Text>
        <Text style={styles.infoText}>✓ Touch-based Emotion Switching</Text>
        <Text style={styles.infoText}>✓ Free Lottie Animations</Text>
        <Text style={styles.infoText}>✓ Smooth Transitions</Text>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Current: {currentEmotion.toUpperCase()}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  avatarContainer: {
    marginVertical: 20,
  },
  emotionButtons: {
    width: '100%',
    marginVertical: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginVertical: 4,
    lineHeight: 20,
  },
  footerContainer: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default HomeScreen;
