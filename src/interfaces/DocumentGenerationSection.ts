import type DocumentOutputReturn from './DocumentOutputReturn';
import type GenerationSection from './GenerationSection';
import type OutputDocumentTag from './OutputDocumentTag';

export interface DocumentGenerationSection extends GenerationSection{
	outputReturns:DocumentOutputReturn[],
	outputDocumentTag:OutputDocumentTag;
	returnAllInputs:boolean;
	returnAllVariables:boolean;
};

export default DocumentGenerationSection;