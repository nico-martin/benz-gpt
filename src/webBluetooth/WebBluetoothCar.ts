class WebBluetoothCar extends EventTarget {
  private service: BluetoothRemoteGATTService;
  private characteristic: BluetoothRemoteGATTCharacteristic;
  private _value: [number, number];
  private _connected: boolean = false;

  constructor() {
    super();
    this._value = [100, 100];
    this._connected = false;
  }

  get connected() {
    return this._connected;
  }

  private set connected(connected: boolean) {
    this._connected = connected;
    this.dispatchEvent(new Event('connectedChanged'));
  }

  public onConnectedChanged = (callback: (connected: boolean) => void) => {
    const listener = () => callback(this.connected);
    this.addEventListener('connectedChanged', listener);
    return () => this.removeEventListener('connectedChanged', listener);
  };

  get value() {
    return this._value;
  }

  private set value(value: [number, number]) {
    this._value = value;
    this.dispatchEvent(new Event('valueChanged'));
  }

  public onValueChanged = (callback: (value: [number, number]) => void) => {
    const listener = () => callback(this.value);
    this.addEventListener('valueChanged', listener);
    return () => this.removeEventListener('valueChanged', listener);
  };

  public connect = async (serviceUUid: string, characteristicUUid: string) => {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [serviceUUid] }],
      optionalServices: [serviceUUid],
    });
    device.addEventListener('gattserverdisconnected', () => {
      this.connected = false;
    });
    const server = await device.gatt.connect();
    this.service = await server.getPrimaryService(serviceUUid);
    this.characteristic =
      await this.service.getCharacteristic(characteristicUUid);
    this.characteristic.addEventListener('characteristicvaluechanged', (e) => {
      const v = (e.target as BluetoothRemoteGATTCharacteristic).value;
      this.value = [v.getUint8(0), v.getUint8(1)];
    });
    this.characteristic.startNotifications();
    const v = await this.characteristic.readValue();
    this.value = [v.getUint8(0), v.getUint8(1)];
    this.connected = true;
  };

  public send = async (value: [number, number]) => {
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    view.setUint8(0, value[0]);
    view.setUint8(1, value[1]);
    return await this.characteristic.writeValue(buffer);
  };
}

export default WebBluetoothCar;
