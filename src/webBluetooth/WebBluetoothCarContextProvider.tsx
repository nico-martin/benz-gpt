import React from 'react';
import { context } from './webBluetoothCarContext.ts';
import WebBluetoothCar from './WebBluetoothCar.ts';
const WebBluetoothCarContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const webBluetoothCar = React.useMemo(() => new WebBluetoothCar(), []);
  const connected = React.useSyncExternalStore(
    (cb) => webBluetoothCar.onConnectedChanged(cb),
    () => webBluetoothCar.connected
  );
  const value = React.useSyncExternalStore(
    (cb) => webBluetoothCar.onValueChanged(cb),
    () => webBluetoothCar.value
  );

  return (
    <context.Provider
      value={{
        connect: () =>
          webBluetoothCar.connect(
            '057b4ab6-2c6a-4138-b8e1-3529701d3f7a',
            '41fd3aec-618c-48f6-901c-71e42ac4bf47'
          ),
        connected,
        value,
        send: webBluetoothCar.send,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default WebBluetoothCarContextProvider;
