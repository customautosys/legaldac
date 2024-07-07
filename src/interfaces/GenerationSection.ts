import type InputParameter from './InputParameter';
import type Statement from './Statement';
import type OutputReturn from './OutputReturn';

export interface GenerationSection{
	locale:string,
	inputParameters:InputParameter[],
	statements:Statement[],
	outputReturns:OutputReturn[]
};

export default GenerationSection;