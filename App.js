import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import Eyes from './src/components/Eyes';
import Chat from './src/components/Chat';

export default function App() {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Eyes isListening={isListening} isSpeaking={isSpeaking} />
            <Chat
                onListeningStateChange={setIsListening}
                onSpeakingStateChange={setIsSpeaking}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
});
