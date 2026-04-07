import React, { useEffect, useState, useRef } from 'react';
import * as Speech from 'expo-speech';
import { getAIResponse, initializeOpenAI } from '../services/openaiService';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

export default function Chat({ onListeningStateChange, onSpeakingStateChange }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const initializedRef = useRef(false);
  const isSpeakingRef = useRef(false);

  // Listen for speech recognition results
  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript || '';

    if (event.isFinal) {
      console.log('[Looi] Recognized:', transcript);
      if (transcript.trim()) {
        processUserInput(transcript);
      }
      setCurrentTranscript('');
    } else {
      setCurrentTranscript(transcript);
    }
  });

  // Listen for speech recognition errors
  useSpeechRecognitionEvent('error', (event) => {
    console.error('[Looi] Speech error:', event.error);
    setIsListening(false);
    onListeningStateChange(false);

    // Retry listening
    setTimeout(() => {
      beginListening();
    }, 1000);
  });

  // Listen for speech recognition end
  useSpeechRecognitionEvent('end', () => {
    console.log('[Looi] Speech recognition ended');
    setIsListening(false);
    onListeningStateChange(false);

    // Restart listening if not speaking
    if (!isSpeakingRef.current) {
      setTimeout(() => {
        beginListening();
      }, 500);
    }
  });

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      if (!initializedRef.current) {
        initializedRef.current = true;

        // Initialize OpenAI
        const oaiInitialized = initializeOpenAI();
        console.log('[Looi] OpenAI initialized:', oaiInitialized);

        // Initialize speech recognition permissions
        const speechPermission = await requestPermissions();
        setPermissionGranted(speechPermission);
        console.log('[Looi] Speech permission granted:', speechPermission);

        if (speechPermission) {
          setTimeout(() => {
            beginListening();
          }, 1000);
        }
      }
    };

    initialize();
  }, []);

  const requestPermissions = async () => {
    try {
      const result = await ExpoSpeechRecognitionModule.getPermissionsAsync();

      if (!result.granted) {
        const newResult = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        return newResult.granted;
      }

      return result.granted;
    } catch (error) {
      console.error('[Looi] Permission request failed:', error);
      return false;
    }
  };

  const speak = async (text) => {
    return new Promise((resolve) => {
      setIsSpeaking(true);
      isSpeakingRef.current = true;
      onSpeakingStateChange(true);

      Speech.speak(text, {
        language: 'en',
        rate: 1,
        pitch: 1.1,
        onDone: () => {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          onSpeakingStateChange(false);
          resolve();

          // Resume listening after speaking
          setTimeout(() => {
            beginListening();
          }, 500);
        },
        onError: (error) => {
          console.error('[Looi] TTS Error:', error);
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          onSpeakingStateChange(false);
          resolve();
        },
      });
    });
  };

  const processUserInput = async (transcript) => {
    try {
      // Stop listening while processing
      ExpoSpeechRecognitionModule.stop();
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
    if (isSpeakingRef.current) {
      return;
    }

    const currentPermission = await requestPermissions();

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

    try {
      ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: true,
      });
    } catch (error) {
      console.error('[Looi] Start listening failed:', error);
      setIsListening(false);
      onListeningStateChange(false);
    }
  };

  return null;
}