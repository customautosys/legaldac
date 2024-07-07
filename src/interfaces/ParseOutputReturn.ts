import type OutputReturn from './OutputReturn';

export interface ParseOutputReturn{
	outputReturns:OutputReturn[];
	errors:string;
	warnings:string;
};

export default ParseOutputReturn;