import React from 'react';

import { context, LlmStatus } from './llmContext.ts';
import BuiltInLlm from './BuiltInLlm.ts';

const LlmContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const [status, setStatus] = React.useState<LlmStatus>(LlmStatus.IDLE);
  const llmInstance = React.useMemo(() => new BuiltInLlm(), []);

  const messages = React.useSyncExternalStore(
    (cb) => llmInstance.onMessagesChanged(cb),
    () => llmInstance.messages
  );

  const workerBusy = React.useSyncExternalStore(
    (cb) => llmInstance.onbusyChanged(cb),
    () => llmInstance.busy
  );

  const setup = async (callback: any = () => {}): Promise<void> => {
    setStatus(LlmStatus.LOADING);
    await llmInstance.initialize(callback);
    setStatus(LlmStatus.READY);
  };

  const generate = async (prompt: string = '') =>
    await llmInstance.generate(prompt);

  return (
    <context.Provider
      value={{
        setup,
        generate,
        messages,
        status,
        busy: workerBusy,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default LlmContextProvider;
