import React from 'react';

export interface Context {
  connect: () => Promise<void>;
  connected: boolean;
  send: (data: [number, number]) => Promise<void>;
  value: [number, number];
}

export const context = React.createContext<Context>({
  connect: async () => {},
  connected: false,
  send: async () => {},
  value: [0, 0],
});
