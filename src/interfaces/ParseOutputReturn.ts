import type OutputReturn from './OutputReturn';
import type OutputDocumentTag from './OutputDocumentTag';

export interface ParseOutputReturn{
	outputReturns:OutputReturn[];
	outputDocumentTag?:OutputDocumentTag;
	returnAllInputs?:boolean;
	returnAllVariables?:boolean;
	errors:string;
	warnings:string;
};

export default ParseOutputReturn;