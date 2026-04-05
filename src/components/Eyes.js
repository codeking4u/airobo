import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function Eyes() {
    const blinkAnim1 = useRef(new Animated.Value(0)).current;
    const blinkAnim2 = useRef(new Animated.Value(0)).current;
    const glowAnim1 = useRef(new Animated.Value(1)).current;
    const glowAnim2 = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Natural blinking animation - eyelid closing effect
        const blinkAnimation = Animated.loop(
            Animated.sequence([
                // Eyes fully open
                Animated.delay(2000),

                // Phase 1: Eyelid closing (top and bottom converging)
                Animated.parallel([
                    Animated.timing(blinkAnim1, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: false,
                    }),
                    Animated.timing(blinkAnim2, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim1, {
                        toValue: 0.5,
                        duration: 150,
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim2, {
                        toValue: 0.5,
                        duration: 150,
                        useNativeDriver: false,
                    }),
                ]),

                // Eyes fully closed
                Animated.delay(100),

                // Phase 2: Eyelid opening (top and bottom separating)
                Animated.parallel([
                    Animated.timing(blinkAnim1, {
                        toValue: 0,
                        duration: 150,
                        useNativeDriver: false,
                    }),
                    Animated.timing(blinkAnim2, {
                        toValue: 0,
                        duration: 150,
                        useNativeDriver: false,
                    }),
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
                ]),
            ])
        );

        blinkAnimation.start();

        return () => blinkAnimation.stop();
    }, [blinkAnim1, blinkAnim2, glowAnim1, glowAnim2]);

    // Eyelid height - when blink is 0, height is full; when blink is 1, height is 0 (closed)
    const eyelidHeight1 = blinkAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 0],
    });

    const eyelidHeight2 = blinkAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 0],
    });

    // Glow shadow effect
    const shadowRadius1 = glowAnim1.interpolate({
        inputRange: [0.5, 1],
        outputRange: [10, 40],
    });

    const shadowRadius2 = glowAnim2.interpolate({
        inputRange: [0.5, 1],
        outputRange: [10, 40],
    });

    return (
        <View style={styles.container}>
            {/* Left Eye */}
            <View style={styles.eyeWrapper}>
                <Animated.View
                    style={[
                        styles.eyeContainer,
                        {
                            height: eyelidHeight1,
                            opacity: glowAnim1,
                        },
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.eyeGlow,
                            {
                                shadowRadius: shadowRadius1,
                                shadowOpacity: glowAnim1,
                            },
                        ]}
                    >
                        <View style={styles.eye} />
                    </Animated.View>
                </Animated.View>
            </View>

            {/* Right Eye */}
            <View style={styles.eyeWrapper}>
                <Animated.View
                    style={[
                        styles.eyeContainer,
                        {
                            height: eyelidHeight2,
                            opacity: glowAnim2,
                        },
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.eyeGlow,
                            {
                                shadowRadius: shadowRadius2,
                                shadowOpacity: glowAnim2,
                            },
                        ]}
                    >
                        <View style={styles.eye} />
                    </Animated.View>
                </Animated.View>
            </View>
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
    eyeWrapper: {
        marginHorizontal: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    eyeGlow: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00BFFF',
        shadowOffset: { width: 0, height: 0 },
        elevation: 20,
    },
    eye: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#00D9FF',
        borderWidth: 3,
        borderColor: '#0099CC',
    },
});
