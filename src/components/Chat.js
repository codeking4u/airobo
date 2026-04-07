import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as Speech from 'expo-speech';
import { getAIResponse, initializeOpenAI } from '../services/openaiService';
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

export default function Chat({ onListeningStateChange, onSpeakingStateChange }) {
    const [conversationHistory, setConversationHistory] = useState([]);
    const initializedRef = useRef(false);
    const isSpeakingRef = useRef(false);
    const isProcessingRef = useRef(false);
    const errorCountRef = useRef(0);
    const networkErrorCountRef = useRef(0);
    const permissionRef = useRef(false);
    const listeningRef = useRef(false);
    const useOnDeviceRef = useRef(false);  // fallback flag

    // ── Speech Recognition Events ──────────────────────────────

    useSpeechRecognitionEvent('result', (event) => {
        // Ignore results while speaking (could pick up own voice)
        if (isSpeakingRef.current || isProcessingRef.current) return;

        const transcript = event.results[0]?.transcript || '';

        if (event.isFinal && transcript.trim().length > 1) {
            console.log('[Looi] Recognized:', transcript);
            processUserInput(transcript);
        }
    });

    useSpeechRecognitionEvent('error', (event) => {
        console.warn('[Looi] Speech error:', event.error);
        listeningRef.current = false;
        onListeningStateChange(false);

        // Don't restart if we're speaking or processing
        if (isSpeakingRef.current || isProcessingRef.current) return;

        // Track network errors specifically
        if (event.error === 'network') {
            networkErrorCountRef.current += 1;
            console.log('[Looi] Network error count:', networkErrorCountRef.current);

            // After 2 network errors, switch to on-device recognition
            if (networkErrorCountRef.current >= 2 && !useOnDeviceRef.current) {
                console.log('[Looi] Switching to on-device recognition');
                useOnDeviceRef.current = true;
            }
        }

        // Back off on repeated errors
        const delay = Math.min(2000 * (errorCountRef.current + 1), 10000);
        errorCountRef.current += 1;
        setTimeout(() => beginListening(), delay);
    });

    useSpeechRecognitionEvent('end', () => {
        listeningRef.current = false;
        onListeningStateChange(false);

        // Only restart if not speaking/processing (continuous mode ended naturally)
        if (!isSpeakingRef.current && !isProcessingRef.current) {
            setTimeout(() => beginListening(), 300);
        }
    });

    // ── Initialize ─────────────────────────────────────────────

    useEffect(() => {
        const initialize = async () => {
            if (initializedRef.current) return;
            initializedRef.current = true;

            const oaiOk = initializeOpenAI();
            console.log('[Looi] OpenAI initialized:', oaiOk);

            const perm = await requestPermissions();
            permissionRef.current = perm;
            console.log('[Looi] Speech permission:', perm);

            // Check what speech recognition capabilities are available
            let speechAvailable = false;
            let onDeviceSupported = false;
            try {
                speechAvailable = await ExpoSpeechRecognitionModule.isRecognitionAvailable();
                console.log('[Looi] Speech recognition available:', speechAvailable);
            } catch (e) {
                console.warn('[Looi] Recognition check failed:', e);
            }

            try {
                const supported = await ExpoSpeechRecognitionModule.supportsOnDeviceRecognition();
                onDeviceSupported = !!supported;
                console.log('[Looi] On-device recognition supported:', onDeviceSupported);
            } catch (e) {
                console.warn('[Looi] On-device check failed:', e);
            }

            // Prefer on-device to avoid network errors
            if (onDeviceSupported) {
                useOnDeviceRef.current = true;
                console.log('[Looi] Will use on-device recognition');
            }

            // Build and speak greeting
            const greeting = buildGreeting(oaiOk, perm, speechAvailable);
            await speak(greeting);

            if (perm && speechAvailable) {
                // Force-reset all refs before first listen attempt
                isSpeakingRef.current = false;
                isProcessingRef.current = false;
                listeningRef.current = false;
                console.log('[Looi] Starting to listen...');
                setTimeout(() => beginListening(), 800);
            } else if (perm && !speechAvailable) {
                console.error('[Looi] Speech recognition not available on this device');
            }
        };

        initialize();
    }, []);

    const buildGreeting = (oaiOk, micOk, speechOk) => {
        if (!speechOk) {
            return "Hi, I'm Looi. Speech recognition is not available on this device. Please install Google app or Speech Services.";
        }
        if (oaiOk && micOk) {
            return "Hi! I'm Looi. Everything is ready. Talk to me!";
        }
        if (!oaiOk && !micOk) {
            return "Hi, I'm Looi. Microphone and AI are not connected.";
        }
        if (!micOk) {
            return "Hi, I'm Looi. I'm connected to AI, but I can't hear you. Please allow microphone access.";
        }
        return "Hi, I'm Looi. I can hear you, but my brain isn't connected. Please check the API key.";
    };

    // ── Permissions ────────────────────────────────────────────

    const requestPermissions = async () => {
        try {
            const result = await ExpoSpeechRecognitionModule.getPermissionsAsync();
            if (result.granted) return true;
            const newResult = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
            return newResult.granted;
        } catch (error) {
            console.error('[Looi] Permission error:', error);
            return false;
        }
    };

    // ── Text-to-Speech ─────────────────────────────────────────

    const speak = (text) => {
        return new Promise((resolve) => {
            isSpeakingRef.current = true;
            onSpeakingStateChange(true);

            Speech.speak(text, {
                language: 'en',
                rate: 1,
                pitch: 1.1,
                onDone: () => {
                    isSpeakingRef.current = false;
                    onSpeakingStateChange(false);
                    resolve();
                },
                onError: (error) => {
                    console.error('[Looi] TTS error:', error);
                    isSpeakingRef.current = false;
                    onSpeakingStateChange(false);
                    resolve();
                },
            });
        });
    };

    // ── Process Voice Input ────────────────────────────────────

    const processUserInput = async (transcript) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        try {
            // Abort mic immediately so it doesn't pick up our own speech
            try { ExpoSpeechRecognitionModule.abort(); } catch (_) { }
            listeningRef.current = false;
            onListeningStateChange(false);

            // Get AI response
            console.log('[Looi] Asking OpenAI:', transcript);
            const aiResponse = await getAIResponse(transcript, conversationHistory);
            console.log('[Looi] Response:', aiResponse);

            // Update conversation history
            setConversationHistory((prev) => [
                ...prev,
                { role: 'user', content: transcript },
                { role: 'assistant', content: aiResponse },
            ]);

            // Reset error count on success
            errorCountRef.current = 0;

            // Speak response
            await speak(aiResponse);
        } catch (error) {
            console.error('[Looi] OpenAI error:', error?.message || error);
            errorCountRef.current += 1;

            // Only say error message on first few failures, then go silent
            if (errorCountRef.current <= 2) {
                await speak("Hmm, I can't connect right now.");
            }

            // If errors keep happening, wait longer before retrying
            if (errorCountRef.current >= 5) {
                console.warn('[Looi] Too many errors, pausing for 30s');
                await new Promise((r) => setTimeout(r, 30000));
            }
        } finally {
            isProcessingRef.current = false;
            // Resume listening after everything is done
            setTimeout(() => beginListening(), 600);
        }
    };

    // ── Start Listening ────────────────────────────────────────

    const beginListening = async () => {
        console.log('[Looi] beginListening called - speaking:', isSpeakingRef.current, 'processing:', isProcessingRef.current, 'listening:', listeningRef.current);

        // Guard: don't start if speaking, processing, or already listening
        if (isSpeakingRef.current || isProcessingRef.current || listeningRef.current) {
            console.log('[Looi] Skipping listen - busy');
            return;
        }

        // Check permission once (don't re-request every time – avoids system popups)
        if (!permissionRef.current) {
            const perm = await requestPermissions();
            permissionRef.current = perm;
            if (!perm) return;
        }

        listeningRef.current = true;
        onListeningStateChange(true);

        try {
            const options = {
                lang: 'en-US',
                interimResults: true,
                requiresOnDeviceRecognition: useOnDeviceRef.current,
            };
            console.log('[Looi] Starting speech recognition, onDevice:', useOnDeviceRef.current);
            ExpoSpeechRecognitionModule.start(options);
            console.log('[Looi] Speech recognition started successfully');
            // Reset error count on successful start
            errorCountRef.current = 0;
        } catch (error) {
            console.error('[Looi] Start failed:', error);
            listeningRef.current = false;
            onListeningStateChange(false);
        }
    };

    return null;
}