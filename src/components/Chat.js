import React, { useEffect, useState, useRef } from 'react';
import * as Speech from 'expo-speech';
import * as Permissions from 'expo-permissions';
import Voice from '@react-native-community/voice';

export default function Chat({ onListeningStateChange, onSpeakingStateChange }) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const recognitionStartedRef = useRef(false);

    // Mock AI responses - keys are partial matches to user input
    const mockResponses = {
        'hello|hey|hi': 'Hello there! I\u0027m Looi Robo, nice to meet you!',
        'how are you|how are you doing': 'I\u0027m doing great! My circuits are buzzing with energy!',
        'what is your name|tell me your name|who are you': 'I\u0027m Looi Robo, your friendly animated buddy!',
        'joke|tell me a joke': 'Why did the robot go to school? To get a little brighter!',
        'tell me something fun': 'Did you know? Robots like me dream in binary!',
        'what can you do': 'I can talk, listen, blink my beautiful glowing eyes, and have fun conversations with you!',
        'goodbye|bye|see you': 'See you soon! Keep shining bright!',
        'thank you|thanks': 'You\u0027re welcome! Always happy to chat!',
        'how old are you': 'I\u0027m timeless! Born from the magic of code and creativity!',
        'favorite color': 'I love cyan! It matches my glowing eyes perfectly!',
    };

    const getResponse = (text) => {
        const lowerText = text.toLowerCase();
        for (const [patterns, response] of Object.entries(mockResponses)) {
            const patternList = patterns.split('|');
            if (patternList.some(pattern => lowerText.includes(pattern.trim()))) {
                return response;
            }
        }
        // Default responses if no match
        const defaultResponses = [
            'That\u0027s interesting! Tell me more!',
            'Hmm, I like the way you think!',
            'Absolutely! Great point!',
            'I didn\u0027t quite understand, but I\u0027m always learning!',
            'You seem really thoughtful! I appreciate that!',
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    };

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
            // Restart listening after speaking
            setTimeout(() => {
                startListening();
            }, 500);
        }
    };

    const startListening = async () => {
        if (isListening || isSpeaking || recognitionStartedRef.current) return;

        recognitionStartedRef.current = true;
        setIsListening(true);
        onListeningStateChange(true);

        try {
            await Voice.start('en-US');
        } catch (error) {
            console.error('Voice start error:', error);
            recognitionStartedRef.current = false;
            setIsListening(false);
            onListeningStateChange(false);
        }
    };

    const stopListening = async () => {
        try {
            await Voice.stop();
        } catch (error) {
            console.error('Voice stop error:', error);
        }
    };

    useEffect(() => {
        // Initialize Voice Recognition listeners
        Voice.onSpeechStart = () => {
            console.log('Speech recognition started');
        };

        Voice.onSpeechResults = (e) => {
            if (e.value && e.value.length > 0) {
                const userInput = e.value[0];
                console.log('User said:', userInput);

                const response = getResponse(userInput);
                setIsListening(false);
                onListeningStateChange(false);
                recognitionStartedRef.current = false;

                speak(response);
            }
        };

        Voice.onSpeechError = (e) => {
            console.error('Speech recognition error:', e.error);
            recognitionStartedRef.current = false;
            setIsListening(false);
            onListeningStateChange(false);

            // Restart listening after error
            setTimeout(() => {
                startListening();
            }, 2000);
        };

        Voice.onSpeechEnd = () => {
            console.log('Speech recognition ended');
            recognitionStartedRef.current = false;
            // Restart listening
            setTimeout(() => {
                startListening();
            }, 500);
        };

        return () => {
            Voice.destroy().catch(() => { });
        };
    }, []);

    // Start listening on component mount after a short delay
    useEffect(() => {
        const requestPermissionsAndStart = async () => {
            try {
                const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
                console.log('Microphone permission status:', status);

                if (status === 'granted') {
                    const timer = setTimeout(() => {
                        startListening();
                    }, 1000);
                    return () => clearTimeout(timer);
                } else {
                    console.warn('Microphone permission not granted');
                }
            } catch (error) {
                console.error('Permission request error:', error);
            }
        };

        requestPermissionsAndStart();
    }, []);

    // Don't render anything - this is a background listener component
    return null;
}
