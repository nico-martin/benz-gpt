import WebBluetoothCar from './WebBluetoothCar.ts';

class Benz extends EventTarget {
  private webBluetoothInstance: WebBluetoothCar;
  private speed: number = 0;
  private turn: number = 0;
  public _connected: boolean = false;

  constructor() {
    super();
    this.webBluetoothInstance = new WebBluetoothCar();
    this.webBluetoothInstance.onConnectedChanged((connected) => {
      this.connected = connected;
    });
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

  public connect = async (): Promise<void> => {
    await this.webBluetoothInstance.connect();
  };

  public changeSpeed = (speed: number) => {
    this.speed = speed > 100 ? 100 : speed < -100 ? -100 : speed;
    this.updateCharacteristics();
  };

  public changeTurn = (turn: number) => {
    this.turn = turn > 90 ? 90 : turn < -90 ? -90 : turn;
    this.updateCharacteristics();
  };

  private calculateWheelSpeeds = (
    speed: number,
    turn: number,
    throttling: number = 1
  ): { leftWheel: number; rightWheel: number } => {
    turn = Math.max(-90, Math.min(90, turn));
    const leftWheelFactor = turn <= 0 ? (90 + turn) / 90 : 1;
    const rightWheelFactor = turn >= 0 ? (90 - turn) / 90 : 1;

    const leftWheel = Math.round(speed * leftWheelFactor) * throttling;
    const rightWheel = Math.round(speed * rightWheelFactor) * throttling;

    return { leftWheel, rightWheel };
  };

  private updateCharacteristics = async (): Promise<void> => {
    const { leftWheel, rightWheel } = this.calculateWheelSpeeds(
      this.speed,
      this.turn,
      0.5
    );

    // Adjust to the byte range 0-200
    const [leftSpeed, rightSpeed] = [leftWheel + 100, rightWheel + 100];

    console.log('BLE SEND', { leftSpeed, rightSpeed }, this.connected);
    if (this.connected) {
      await this.webBluetoothInstance.send([leftSpeed, rightSpeed]);
    }
  };
}

export default Benz;
