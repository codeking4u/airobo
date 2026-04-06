import * as ExpoSpeechRecognition from 'expo-speech-recognition';

export const initializeSpeechRecognition = async () => {
  try {
    const result = await ExpoSpeechRecognition.requestPermissionsAsync();
    return result.granted;
  } catch (error) {
    console.error('Permission request failed:', error);
    return false;
  }
};

export const startListening = async (onResult, onError) => {
  try {
    await ExpoSpeechRecognition.start({
      lang: 'en-US',
      maxResults: 1,
      interimResults: true,
    });

    // Setup event listeners
    ExpoSpeechRecognition.addRecognitionResultsListener(onResult);
    ExpoSpeechRecognition.addRecognitionErrorListener(onError);
  } catch (error) {
    console.error('Start listening failed:', error);
    onError(error);
  }
};

export const stopListening = async () => {
  try {
    await ExpoSpeechRecognition.stop();
  } catch (error) {
    console.error('Stop listening failed:', error);
  }
};

export const abortListening = async () => {
  try {
    await ExpoSpeechRecognition.abort();
  } catch (error) {
    console.error('Abort listening failed:', error);
  }
};
