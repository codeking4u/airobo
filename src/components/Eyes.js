import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Pressable } from 'react-native';

export default function Eyes() {
    const blinkAnim1 = useRef(new Animated.Value(0)).current;
    const blinkAnim2 = useRef(new Animated.Value(0)).current;
    const glowAnim1 = useRef(new Animated.Value(1)).current;
    const glowAnim2 = useRef(new Animated.Value(1)).current;
    const [winkEye, setWinkEye] = useState(null);

    const triggerWink = (eye) => {
        setWinkEye(eye);
        const targetAnim = eye === 1 ? blinkAnim1 : blinkAnim2;
        const glowTargetAnim = eye === 1 ? glowAnim1 : glowAnim2;

        Animated.parallel([
            Animated.sequence([
                Animated.timing(targetAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: false,
                }),
                Animated.delay(100),
                Animated.timing(targetAnim, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false,
                }),
            ]),
            Animated.sequence([
                Animated.timing(glowTargetAnim, {
                    toValue: 0.3,
                    duration: 100,
                    useNativeDriver: false,
                }),
                Animated.delay(100),
                Animated.timing(glowTargetAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: false,
                }),
            ]),
        ]).start(() => setWinkEye(null));
    };

    useEffect(() => {
        const blinkAnimation = Animated.loop(
            Animated.sequence([
                Animated.delay(2000),

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

                Animated.delay(100),

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

    const eyelidHeight1 = blinkAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 0],
    });

    const eyelidHeight2 = blinkAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 0],
    });

    const shadowRadius1 = glowAnim1.interpolate({
        inputRange: [0.5, 1],
        outputRange: [10, 40],
    });

    const shadowRadius2 = glowAnim2.interpolate({
        inputRange: [0.5, 1],
        outputRange: [10, 40],
    });

    return (
        <Pressable style={styles.container}>
            {/* Left Eye - Tap to wink */}
            <Pressable
                style={styles.eyeWrapper}
                onPress={() => triggerWink(1)}
            >
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
            </Pressable>

            {/* Right Eye - Tap to wink */}
            <Pressable
                style={styles.eyeWrapper}
                onPress={() => triggerWink(2)}
            >
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
            </Pressable>
        </Pressable>
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
