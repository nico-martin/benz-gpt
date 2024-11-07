const textToSpeech = (text: string): Promise<void> =>
  new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    const voices = speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang === 'en-US');
    utterance.voice = voices[0];
    utterance.onend = () => {
      resolve();
    };
    speechSynthesis.speak(utterance);
  });

export default textToSpeech;
