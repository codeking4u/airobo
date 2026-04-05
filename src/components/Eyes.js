import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function Eyes() {
    const glowAnim1 = useRef(new Animated.Value(0)).current;
    const glowAnim2 = useRef(new Animated.Value(0)).current;
    const scaleAnim1 = useRef(new Animated.Value(1)).current;
    const scaleAnim2 = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Blinking animation - also affects glow
        const blinkAnimation = Animated.loop(
            Animated.sequence([
                // Eyes open - full glow
                Animated.timing(glowAnim1, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim2, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: false,
                }),
                // Eyes stay open for a bit
                Animated.delay(1500),
                // Eyes closing - glow fades
                Animated.parallel([
                    Animated.timing(glowAnim1, {
                        toValue: 0.3,
                        duration: 150,
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim2, {
                        toValue: 0.3,
                        duration: 150,
                        useNativeDriver: false,
                    }),
                    Animated.timing(scaleAnim1, {
                        toValue: 0.2,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim2, {
                        toValue: 0.2,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ]),
                // Eyes closed
                Animated.delay(200),
                // Eyes opening back
                Animated.parallel([
                    Animated.timing(glowAnim1, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim2, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: false,
                    }),
                    Animated.timing(scaleAnim1, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim2, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        );

        blinkAnimation.start();

        return () => blinkAnimation.stop();
    }, [glowAnim1, glowAnim2, scaleAnim1, scaleAnim2]);

    // Glow shadow effect
    const glowShadow1 = glowAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 30],
    });

    const glowShadow2 = glowAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 30],
    });

    return (
        <View style={styles.container}>
            {/* Left Eye */}
            <Animated.View
                style={[
                    styles.eyeContainer,
                    {
                        transform: [{ scale: scaleAnim1 }],
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.eyeGlow,
                        {
                            shadowRadius: glowShadow1,
                            shadowOpacity: glowAnim1,
                        },
                    ]}
                >
                    <View style={styles.eye} />
                </Animated.View>
            </Animated.View>

            {/* Right Eye */}
            <Animated.View
                style={[
                    styles.eyeContainer,
                    {
                        transform: [{ scale: scaleAnim2 }],
                        marginLeft: 80,
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.eyeGlow,
                        {
                            shadowRadius: glowShadow2,
                            shadowOpacity: glowAnim2,
                        },
                    ]}
                >
                    <View style={styles.eye} />
                </Animated.View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    eyeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeGlow: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00BFFF',
        shadowOffset: { width: 0, height: 0 },
    },
    eye: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#00D9FF',
        borderWidth: 2,
        borderColor: '#0099CC',
    },
});
