import React from 'react';
import { context } from './webBluetoothCarContext.ts';

const useWebBluetoothCar = () => React.useContext(context);

export default useWebBluetoothCar;
