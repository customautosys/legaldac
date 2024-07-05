import {cli} from './exports';

export * from './exports';
export * as default from './exports';

if(globalThis.require.main!==globalThis.module)cli();