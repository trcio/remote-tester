import type {SledConfig} from '@sled';

const config = {
  entrypoint: 'server.ts',
  static: [],
  devices: {
    esp32: {dimensions: '1d'},
  },
  streams: {},
  programs: {
    wipe: {
      headers: [],
      cpp: ['wipe.cpp'],
    },
  },
} satisfies SledConfig;

type Config = typeof config;
declare module '@sled' {
  interface GlobalConfig extends Config {}
}

export default config;
