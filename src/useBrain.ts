import React from 'react';
import SpeechToText from '@utils/SpeechToText.ts';
import textToSpeech from '@utils/textToSpeech.ts';
import useLlm from './llm/useLlm.ts';

const useBrain = () => {
  const { generate } = useLlm();

  const functions = {
    move: (speed: number) => {
      console.log('Move', speed);
    },
    turn: (angle: number) => {
      console.log('Turn', angle);
    },
  };

  const processRequest = async (request: string) => {
    const message = await generate(request);
    if (message?.parsed?.function && message.parsed.function in functions) {
      functions[message.parsed.function](message.parsed.parameter);
    }
    await textToSpeech(message?.parsed?.message || message.content);
  };

  React.useEffect(() => {
    const speechToText = new SpeechToText();
    const keydown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        speechToText.start();
      }
    };
    const keyup = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        speechToText.stop().then(async (text) => processRequest(text));
      }
    };

    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup', keyup);
    };
  }, []);

  return {
    processRequest,
  };
};

export default useBrain;
