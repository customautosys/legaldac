import type OutputDocumentTag from './OutputDocumentTag';
import type ParseOutputReturn from './ParseOutputReturn';

export interface DocumentParseOutputReturn extends ParseOutputReturn{
	outputDocumentTag:OutputDocumentTag;
	returnAllInputs:boolean;
	returnAllVariables:boolean;
};

export default DocumentParseOutputReturn;