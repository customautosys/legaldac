import esMain from 'es-main';
import {cli} from './exports';

export * from './exports';
export * as default from './exports';

if(esMain(import.meta))cli();