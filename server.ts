import {devices} from '@sled';

const {esp32} = devices();
await esp32.useProgram('wipe');
await esp32.invalidate();
