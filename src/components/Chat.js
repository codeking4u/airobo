import React, { useEffect, useState, useRef } from 'react';
import * as Speech from 'expo-speech';
import { getAIResponse, initializeOpenAI } from '../services/openaiService';
import {
    initializeSpeechRecognition,
    startListening,
    stopListening,
    abortListening,
} from '../services/voiceRecognitionService';

export default function Chat({ onListeningStateChange, onSpeakingStateChange }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [currentTranscript, setCurrentTranscript] = useState('');
    const initializedRef = useRef(false);

    // Initialize on mount
    useEffect(() => {
        const initialize = async () => {
            if (!initializedRef.current) {
                initializedRef.current = true;

                // Initialize OpenAI
                const oaiInitialized = initializeOpenAI();
                console.log('[Looi] OpenAI initialized:', oaiInitialized);

                // Initialize speech recognition permissions
                const speechPermission = await initializeSpeechRecognition();
                setPermissionGranted(speechPermission);
                console.log('[Looi] Speech permission granted:', speechPermission);

                if (speechPermission) {
                    // Start listening after a short delay
                    setTimeout(() => {
                        beginListening();
                    }, 1000);
                }
            }
        };

        initialize();
    }, []);

    const speak = async (text) => {
        return new Promise((resolve) => {
            setIsSpeaking(true);
            onSpeakingStateChange(true);

            Speech.speak(text, {
                language: 'en',
                rate: 1,
                pitch: 1.1,
                onDone: () => {
                    setIsSpeaking(false);
                    onSpeakingStateChange(false);
                    resolve();
                },
                onError: (error) => {
                    console.error('TTS Error:', error);
                    setIsSpeaking(false);
                    onSpeakingStateChange(false);
                    resolve();
                },
            });
        });
    };

    const handleSpeechResult = async (result) => {
        if (!result.isFinal) {
            setCurrentTranscript(result.value[0] || '');
            return;
        }

        // Final result received
        const transcript = result.value[0] || '';
        console.log('[Looi] Recognized:', transcript);

        if (transcript.trim()) {
            await processUserInput(transcript);
        }

        // Reset and start listening again
        setCurrentTranscript('');
        setTimeout(() => {
            beginListening();
        }, 500);
    };

    const handleSpeechError = (error) => {
        console.error('[Looi] Speech error:', error);
        setIsListening(false);
        onListeningStateChange(false);

        // Retry listening
        setTimeout(() => {
            beginListening();
        }, 1000);
    };

    const processUserInput = async (transcript) => {
        try {
            await stopListening();
            setIsListening(false);
            onListeningStateChange(false);

            // Add to history
            const updatedHistory = [
                ...conversationHistory,
                { role: 'user', content: transcript },
            ];

            // Get AI response
            console.log('[Looi] Sending to OpenAI...');
            const aiResponse = await getAIResponse(transcript, conversationHistory);
            console.log('[Looi] Response:', aiResponse);

            // Update history
            setConversationHistory([
                ...updatedHistory,
                { role: 'assistant', content: aiResponse },
            ]);

            // Speak response
            await speak(aiResponse);
        } catch (error) {
            console.error('[Looi] Error:', error);
            await speak('Sorry, I had an error. Can you say that again?');
        }
    };

    const beginListening = async () => {
        if (isSpeaking) {
            return;
        }

        // Re-check permission each time (in case it was granted in settings)
        const currentPermission = await initializeSpeechRecognition();

        if (!currentPermission) {
            console.log('[Looi] Cannot start listening - permission not granted');
            setPermissionGranted(false);
            return;
        }

        setPermissionGranted(true);
        setIsListening(true);
        onListeningStateChange(true);
        setCurrentTranscript('');

        console.log('[Looi] Listening...');
        startListening(handleSpeechResult, handleSpeechError);
    };

    return null;
}
