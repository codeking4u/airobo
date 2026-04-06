import React, { useEffect, useState, useRef } from 'react';
import * as Speech from 'expo-speech';

export default function Chat({ onListeningStateChange, onSpeakingStateChange }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [responseQueue, setResponseQueue] = useState([]);

    // Mock AI responses
    const mockResponses = [
        'Hello there! I\u0027m Looi Robo!',
        'What an interesting question!',
        'I love talking with you!',
        'That\u0027s so cool!',
        'Tell me more about that!',
        'I\u0027m having fun!',
    ];

    const speak = async (text) => {
        setIsSpeaking(true);
        onSpeakingStateChange(true);
        try {
            await Speech.speak(text, {
                language: 'en',
                rate: 1,
                pitch: 1.1,
            });
        } catch (error) {
            console.error('TTS Error:', error);
        } finally {
            setIsSpeaking(false);
            onSpeakingStateChange(false);
        }
    };

    // Speak a random response every 8 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isSpeaking) {
                const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
                speak(randomResponse);
            }
        }, 8000);

        return () => clearInterval(interval);
    }, [isSpeaking]);
    return null;
}
