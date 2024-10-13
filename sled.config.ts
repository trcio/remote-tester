export default {
  entrypoint: 'server.ts',
  static: [],
  devices: {
    main: {dimensions: '1d'},
  },
  streams: {},
  binaries: {
    wipe: {
      headers: [],
      cpp: ['wipe.cpp'],
    },
  },
} satisfies SledConfig;
