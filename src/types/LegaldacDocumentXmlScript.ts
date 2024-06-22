import LegaldacXmlScript from './LegaldacXmlScript';
import type ClauseRepository from './ClauseRepository';
import type InputParameter from './InputParameter';
import type PreserveOrderXmlNode from './PreserveOrderXmlNode';

export class LegaldacDocumentXmlScript extends LegaldacXmlScript{
	async parse(xml:string,clauseRepository:ClauseRepository){
		return super.parse(xml,clauseRepository,'document');
	}

	async parseOutputs(generationNodes:PreserveOrderXmlNode[],parsedXml:PreserveOrderXmlNode[],inputParameters:InputParameter[],clauseRepository:ClauseRepository){
		return [];
	}
};

export default LegaldacDocumentXmlScript;