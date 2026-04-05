import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Avatar = ({ emotion = 'happy', size = 250 }) => {
  const animationRef = useRef(null);

  const animationMap = {
    happy: 'https://assets8.lottiefiles.com/packages/lf20_7m2dyo2n.json',
    sad: 'https://assets10.lottiefiles.com/packages/lf20_4ieyfpsx.json',
    surprised: 'https://assets9.lottiefiles.com/packages/lf20_uowis2fq.json',
  };

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, [emotion]);

  const animationSource = animationMap[emotion] || animationMap.happy;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LottieView
        ref={animationRef}
        source={{ uri: animationSource }}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});

export default Avatar;
