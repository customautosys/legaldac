import type PromptOption from './PromptOption';

export interface PromptQuestion{
	variable:string;
	label:string;
	options?:PromptOption[];
};

export default PromptQuestion;