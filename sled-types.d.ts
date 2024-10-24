declare module 'fft-buffer' {
  /**
   * expects the first 4 bytes to be the sample rate (Hz) as an uint32_t, little endian
   */
  export class FftBuffer {
    private bins;
    private nyquist;
    constructor();
    update(buffer: Buffer): void;
    getEnergy(lowFrequency: number, highFrequency: number): number;
  }
}
declare module '@sled' {
  import type {Middleware} from 'koa';
  import type {z} from 'zod';
  export const SLED_USER_MODULE_IDENTIFIER = '@sled';
  /**
   * retrieves information about all connected devices
   *
   * NOTE some slots may not be connected, the mapped device will be a dummy object
   * @returns an object where each key is a slot name and the corresponding value is the device in that slot
   */
  export function devices(): DeviceSlotMap;
  /**
   * retrieves information about all connected streams
   *
   * NOTE some slots may not be connected, the mapped stream will be a dummy object
   * @returns an object where each key is a slot name and the corresponding value is the stream in that slot
   */
  export function streams(): StreamSlotMap;
  /**
   * generates a udp multicast address and
   * @param devices the recipient devices
   */
  export function realtime(...devices: Device[]): Promise<RealtimeGroup>;
  /**
   * opens an HTTP server that is accessible via proxy from the host
   * @param middleware the middleware to use for the server
   */
  export function listen(...middleware: Middleware[]): Promise<void>;
  /**
   * creates a middleware that handles sled rpc requests
   * @param spec the rpc spec
   */
  export function rpcMiddleware(spec: RpcSpec): Middleware;
  /**
   * serves the contents of a directory in this repo (files must be included in the config)
   * @param root the root directory to serve
   * @param defaultIndex the file to serve when a path is not found (useful for single-page apps)
   */
  export function staticMiddleware(root: string, defaultIndex: string): Middleware;
  export enum SledEvents {
    StreamPacket = 'stream-packet',
    Dispose = 'dispose',
  }
  export type SledEventToArgs = {
    [SledEvents.StreamPacket]: [stream: Stream, buffer: Buffer];
    [SledEvents.Dispose]: [];
  };
  /**
   * subscribe to stream packet events
   *
   * NOTE only one callback can be registered at a time
   * @param callback the function to call when a new packet is received
   */
  export function on(eventName: SledEvents.StreamPacket, callback: (...args: SledEventToArgs[SledEvents.StreamPacket]) => void | Promise<void>): void;
  /**
   * subscribe to dispose events
   *
   * NOTE only one callback can be registered at a time
   * @param callback the function to call when the worker is disposed
   */
  export function on(eventName: SledEvents.Dispose, callback: (...args: SledEventToArgs[SledEvents.Dispose]) => void | Promise<void>): void;
  export type Globals = {
    setInterval<TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs): number;
    clearInterval(intervalId: string | number | undefined): void;
    setTimeout<TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs): number;
    clearTimeout(timeoutId: string | number | undefined): void;
    Math: Math;
    Buffer: BufferConstructor;
    console: {
      error(error: any, ...args: any[]): void;
      log(...args: any[]): void;
    };
  };
  export type Stream = {
    /**
     * the database id of the stream
     */
    id: number;
    /**
     * the unique name of the stream
     */
    name: string;
  };
  export type Device = {
    /**
     * the database id of the device
     */
    id: number;
    /**
     * the unique name of the device
     */
    name: string;
    /**
     * the width (columns) of the device in pixels
     */
    width: number;
    /**
     * the height (rows) of the device in pixels
     */
    height: number;
    /**
     * sets the program (from this repo) to execute on the device
     *
     * NOTE you must follow up with a call to `invalidate()` to apply the program
     * @param name the name of the program to use
     * @returns a promise that resolves when the configuration has been saved
     */
    useProgram: (name: Extract<keyof GlobalConfig['programs'], string>) => Promise<void>;
    /**
     * sets the program-accessible settings for the device
     *
     * NOTE you must follow up with a call to `invalidate()` to apply the settings
     * @param buffer the settings to use
     * @returns a promise that resolves when the configuration has been saved
     */
    useSettings: (buffer: Buffer) => Promise<void>;
    /**
     * invalidates the device, causing it to reload the latest configuration from the server
     * @returns a promise that resolves when the device is running the latest configuration
     */
    invalidate: () => Promise<void>;
  };
  export type DeviceSlotMap = {
    [x in keyof GlobalConfig['devices']]: Device;
  };
  export type StreamSlotMap = {
    [x in keyof GlobalConfig['streams']]: Stream;
  };
  export type RealtimeGroup = {
    devices: Device[];
    multicast(buffer: Buffer): void;
  };
  export type RPC<T extends z.ZodType | undefined> = {
    /**
     * (optional) the zod schema for the input object
     */
    input?: T;
    /**
     * the function to call (with the input already validated) when the rpc request is received
     */
    handler: T extends z.ZodType ? (input: z.infer<T>) => Promise<any> : () => Promise<any>;
  };
  export type RpcSpec = {
    /**
     * the name of the rpc endpoint
     */
    [endpointName: string]: RPC<z.ZodType | undefined>;
  };
  export interface SledConfig {
    /**
     * the names of the slots available for devices when deployed
     */
    devices: Record<
      string,
      {
        dimensions: '1d';
      }
    >;
    /**
     * the typescript entrypoint for the server-side code
     */
    entrypoint: string;
    /**
     * paths/globs of any static files to serve over HTTP
     */
    static: readonly string[];
    /**
     * the names of the slots available for streams when deployed
     */
    streams: Record<string, {}>;
    /**
     * the names of the programs available to execute on devices when deployed
     */
    programs: Record<
      string,
      {
        /**
         * paths/globs of the headers to include during compilation
         */
        headers: string[];
        /**
         * paths/globs of the source files to compile
         */
        cpp: string[];
      }
    >;
  }
  export interface GlobalConfig {}
  export * from 'fft-buffer';
}
