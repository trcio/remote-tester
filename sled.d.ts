declare type SledConfig = {
  devices: {
    [name: string]: {dimensions: '1d'};
  };
  entrypoint: string;
  static: readonly string[];
  streams: {
    [name: string]: {};
  };
  binaries: {
    [name: string]: {headers: string[]; cpp: string[]};
  };
};

declare module '@sled' {
  export function realtime<T extends string>(...devices: Device<T>[]): Promise<{multicast(buffer: ArrayBuffer)}>;
  export function devices<TConfig extends SledConfig>(): DeviceCollection<TConfig>;
  export function streams<TConfig extends SledConfig>(): StreamCollection<TConfig>;
  export function listen(...middleware: Middleware[]): Promise<void>;
  export function rpc(spec: any): Middleware;
  export function static(root: string, defaultIndex: string): Middleware;
  export function on(eventName: 'dispose', callback: () => void | Promise<void>): void;
  export function on(eventName: 'dataStreamChunk', callback: (payload: {dataStream: DataStream; buffer: ArrayBuffer}) => void | Promise<void>): void;

  export const z: any;
  export class FftBuffer {
    update(buf: ArrayBuffer): void;
    getEnergy(lowFrequency: number, highFrequency: number): number;
  }

  type DeviceCollection<TConfig extends SledConfig, TArtifacts extends string = Extract<keyof TConfig['binaries'], string>> = {
    [x in keyof TConfig['devices']]: Device<TArtifacts>;
  };

  type StreamCollection<TConfig extends SledConfig> = {
    [x in keyof TConfig['streams']]: DataStream;
  };
  export type Next = () => Promise<any>;
  export type Middleware = (ctx: any, next: Next) => any;

  export type Device<TArtifacts extends string> = {
    readonly status: 'online' | 'offline';
    readonly id: number;
    readonly label: string;
    readonly width: number;
    readonly height: number;
    readonly loadBinary: (label: TArtifacts) => Promise<void>;
    readonly loadSettings: (buffer: ArrayBuffer) => Promise<void>;
  };

  export type DataStream = {
    status: 'online' | 'offline';
    readonly id: number;
    readonly label: string;
  };
}
