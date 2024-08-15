import type PromptQuestion from './PromptQuestion';

export interface PromptParams{
	label?:string;
	questions?:PromptQuestion[];
};

export default PromptParams;