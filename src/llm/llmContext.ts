import React from 'react';
import { Message } from './types.ts';

export enum LlmStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

export interface Context {
  setup: (callback?: (data: any) => void) => Promise<void>;
  generate: (prompt: string) => Promise<Message>;
  messages: Array<Message>;
  status: LlmStatus;
  busy: boolean;
}

export const context = React.createContext<Context>({
  setup: async () => {},
  generate: () => Promise.resolve(null),
  messages: [],
  status: LlmStatus.IDLE,
  busy: false,
});
