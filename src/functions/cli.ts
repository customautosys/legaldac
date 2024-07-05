import {Command} from 'commander';
import package_json from '../../package.json';

export function cli(){
	const program=new Command();
	program
		.version(package_json.version)
		.name('legaldac')
		.option('-d, --debug','enables verbose logging',false)
		.option('-v, --verbose','enables verbose logging',false)
		.argument('<input-filename>','the input filename')
		.parse(process.argv);
	return;
};

export default cli;