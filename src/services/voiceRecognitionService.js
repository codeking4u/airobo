import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';

export const initializeSpeechRecognition = async () => {
  try {
    const result = await ExpoSpeechRecognitionModule.getPermissionsAsync();

    if (!result.granted) {
      const newResult = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      return newResult.granted;
    }

    return result.granted;
  } catch (error) {
    console.error('Permission request failed:', error);
    return false;
  }
};

export const startListening = () => {
  ExpoSpeechRecognitionModule.start({
    lang: 'en-US',
    interimResults: true,
  });
};

export const stopListening = () => {
  ExpoSpeechRecognitionModule.stop();
};

export const abortListening = () => {
  ExpoSpeechRecognitionModule.abort();
};