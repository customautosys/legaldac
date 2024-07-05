import dts from 'rollup-plugin-dts';
import esbuild, { minify } from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';

export default[{
	input:'src/index.ts',
	external:/node_modules/,
	plugins:[
		esbuild({
			minify:true
		}),
		json(),
		nodeResolve()
	],
	output:[{
		file:'dist/index.js',
		format:'es',
		sourcemap:true,
		exports:'auto'
	}]
},{
	input:'src/index.ts',
	plugins:[dts()],
	output:{
		file:'dist/index.d.ts',
		format:'es',
	}
}];