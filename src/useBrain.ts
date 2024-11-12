import React from 'react';
import SpeechToText from '@utils/SpeechToText.ts';
import textToSpeech from '@utils/textToSpeech.ts';
import FunctionCallingPromptAPI from './functionCallingPromptAPI/FunctionCallingPromptAPI.ts';
import { Message } from './functionCallingPromptAPI/types.ts';

export enum Status {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  LISTENING = 'listening',
  THINKING = 'thinking',
  TALKING = 'talking',
  ERROR = 'error',
}

type Listener = {
  start: () => void;
  end: () => Promise<void>;
};

export interface Brain {
  messages: Array<Message>;
  status: Status;
  setup: () => Promise<void>;
  createListener: () => Listener;
  generateAnswer: (text: string) => Promise<Message>;
}

const useBrain = (
  adjustSpeed: (speed: number) => void,
  adjustDirection: (direction: number) => void
): Brain => {
  const [status, setStatus] = React.useState<Status>(Status.IDLE);
  const llmInstance = React.useMemo(() => new FunctionCallingPromptAPI(), []);

  const messages = React.useSyncExternalStore(
    (cb) => llmInstance.onMessagesChanged(cb),
    () => llmInstance.messages
  );

  const setup = async (callback: any = () => {}): Promise<void> => {
    setStatus(Status.LOADING);
    llmInstance.addFunction({
      name: 'move',
      description: 'Sets the new speed of the car',
      parameter: {
        name: 'speed',
        description:
          'can be a number between -100 (full speed backwards), 0 (stand still) and 100 (full speed)',
        type: 'number',
      },
      returnType: 'void',
      examples: [
        {
          message: 'I am moving forward with full speed, speed is set to 100%',
          function: 'move',
          parameter: 100,
        },
        {
          message: 'I did low down a bit. My new speed is 50%',
          function: 'move',
          parameter: 50,
        },
        {
          message:
            'I am moving backward with full speed, speed is set to -100%',
          function: 'move',
          parameter: -100,
        },
      ],
    });

    llmInstance.addFunction({
      name: 'turn',
      description: 'Change the direction of the car',
      parameter: {
        name: 'direction',
        description:
          'can be a number between -90 (max left) and 90 (max right) where 0 is straight',
        type: 'number',
      },
      returnType: 'void',
      examples: [
        {
          message: 'Hard right turn',
          function: 'turn',
          parameter: 90,
        },
        {
          message: 'slight left turn',
          function: 'turn',
          parameter: -45,
        },
      ],
    });
    await llmInstance.initializeSession(
      callback,
      'You are an intelligent car named "BenzGPT"'
    );
    setStatus(Status.READY);
  };

  const functions = {
    move: (speed: number) => {
      if (speed < -100) {
        adjustSpeed(-100);
      } else if (speed > 100) {
        adjustSpeed(100);
      } else {
        adjustSpeed(speed);
      }
    },
    turn: (angle: number) => {
      if (angle < -90) {
        adjustDirection(-90);
      } else if (angle > 90) {
        adjustDirection(90);
      } else {
        adjustDirection(angle);
      }
    },
  };

  const generateAnswer = async (text: string) => {
    const message = await llmInstance.generate(text);
    if (message?.parsed?.function && message.parsed.function in functions) {
      functions[message.parsed.function](message.parsed.parameter);
    }
    return message;
  };

  const createListener = (): Listener => {
    const speechToText = new SpeechToText();
    let started = false;

    return {
      start: () => {
        if (status !== Status.READY) return;
        started = true;
        setStatus(Status.LISTENING);
        speechToText.start();
      },
      end: async () => {
        if (!started) return;
        started = false;
        setStatus(Status.THINKING);
        const text = await speechToText.stop();
        try {
          const message = await generateAnswer(text);
          setStatus(Status.TALKING);
          await textToSpeech(message?.parsed?.message || message.content);
          setStatus(Status.READY);
        } catch (e) {
          console.error(e);
          setStatus(Status.TALKING);
          await textToSpeech('Sorry, I could not understand that');
          setStatus(Status.READY);
        }
      },
    };
  };

  return {
    messages,
    status,
    setup,
    createListener,
    generateAnswer,
  };
};

export default useBrain;
