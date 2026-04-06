import React, { useEffect, useState, useRef } from 'react';
import * as Speech from 'expo-speech';
import { getAIResponse, initializeOpenAI } from '../services/openaiService';

export default function Chat({ onListeningStateChange, onSpeakingStateChange }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([]);
    const initializedRef = useRef(false);

    // Initialize OpenAI
    useEffect(() => {
        if (!initializedRef.current) {
            const initialized = initializeOpenAI();
            initializedRef.current = true;
            if (!initialized) {
                console.warn('Chat: OpenAI not initialized - check EXPO_PUBLIC_OPENAI_API_KEY');
            }
        }
    }, []);

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

    const handleUserInput = async (transcript) => {
        if (!transcript || transcript.trim().length === 0) {
            return;
        }

        try {
            setIsListening(false);
            onListeningStateChange(false);

            // Add user message to history
            const updatedHistory = [
                ...conversationHistory,
                { role: 'user', content: transcript },
            ];

            // Get AI response
            const aiResponse = await getAIResponse(transcript, conversationHistory);

            // Update history with AI response
            setConversationHistory([
                ...updatedHistory,
                { role: 'assistant', content: aiResponse },
            ]);

            // Speak the response
            await speak(aiResponse);

            // Resume listening after speaking
            setTimeout(() => {
                startListening();
            }, 1000);
        } catch (error) {
            console.error('Chat Error:', error);
            await speak('Sorry, I had an error. Let me try again.');
            startListening();
        }
    };

    const startListening = async () => {
        if (isSpeaking) return;

        setIsListening(true);
        onListeningStateChange(true);

        // TODO: Integrate with actual speech recognition library
        // For MVP testing, you can manually provide transcription:
        // handleUserInput("Hello, how are you?");

        console.log('[Looi] Listening...');
    };

    // Start listening on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            startListening();
        }, 2000);

        return () => clearTimeout(timer);
    }, [isSpeaking]);

    // Export handleUserInput for testing/manual input
    useEffect(() => {
        global.looi = { handleUserInput };
    }, [conversationHistory]);

    return null;
}
