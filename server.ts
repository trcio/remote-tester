import {devices} from '@sled';
import config from './sled.config';

const {main} = devices<typeof config>();
await Promise.all([main.loadBinary('wipe')]);
console.log('loaded wipe REMOTELY');
