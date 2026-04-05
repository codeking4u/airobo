import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Eyes from './src/components/Eyes';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <Eyes />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
});
