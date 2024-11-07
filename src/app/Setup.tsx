import React from 'react';
import useLlm from '../llm/useLlm.ts';
import cn from '@utils/classnames.ts';
import styles from './Setup.module.css';

enum SetupState {
  IDLE = 'idle',
  LOADING_LLM = 'loading_llm',
  LOADING_TRANSCRIBER = 'loading_transcriber',
  LOADING_TTS = 'loading_tts',
  DONE = 'done',
}

const Setup: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { setup } = useLlm();
  const [setupState, setSetupState] = React.useState<SetupState>(
    SetupState.IDLE
  );

  return (
    <div className={cn(className, styles.root)}>
      <button
        className={styles.button}
        disabled={setupState !== SetupState.IDLE}
        onClick={async () => {
          setSetupState(SetupState.LOADING_LLM);
          await setup(console.log);
          setSetupState(SetupState.DONE);
        }}
      >
        <span>
          {setupState === SetupState.LOADING_TTS ? (
            <span>
              Loading
              <br />
              TextToSpeech...
            </span>
          ) : setupState === SetupState.LOADING_LLM ? (
            <span>
              Loading
              <br />
              LLM...
            </span>
          ) : setupState === SetupState.LOADING_TRANSCRIBER ? (
            <span>
              Loading
              <br />
              Transcriber...
            </span>
          ) : (
            'Setup'
          )}
        </span>
        <svg
          className={cn(styles.loader)}
          viewBox="0 0 40 40"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="15" />
        </svg>
      </button>
    </div>
  );
};

export default Setup;
