import LegaldacXmlScript from './LegaldacXmlScript';
import type ClauseRepository from './ClauseRepository';
import type InputParameter from './InputParameter';
import type PreserveOrderXmlNode from './PreserveOrderXmlNode';
import type OutputReturn from './OutputReturn';

export class LegaldacClauseXmlScript extends LegaldacXmlScript{
	async parse(xml:string,clauseRepository:ClauseRepository){
		return super.parse(xml,clauseRepository,'clause');
	}

	async parseOutputs(generationNodes:PreserveOrderXmlNode[],parsedXml:PreserveOrderXmlNode[],inputParameters:InputParameter[],clauseRepository:ClauseRepository){
		let errors='';
		let warnings='';
		let outputReturns:OutputReturn[]=[];
		let outputNodes=generationNodes[0].generation.filter(node=>node['output']);
		if(outputNodes.length<1)errors+='\nNo output tag found';
		if(errors)return{
			errors,
			warnings,
			outputReturns
		};
		if(outputNodes.length>1)warnings+='\nMore than 1 output tag found when only 1 is allowed, only parsing 1st output tag';
		let returnNodes=outputNodes[0].input.filter(node=>node['return']);
		if(returnNodes.length>2)errors+='\nMore than 2 return tags found when only either 1 or 2 are allowed';
		if(returnNodes.length<1)errors+='\nNo return tags found';
		if(
			returnNodes.length===2&&!(
				(
					(
						returnNodes[0]?.[':@']?.type==='string'||
						!returnNodes[0]?.[':@']?.type
					)&&
					returnNodes[1]?.[':@']?.type==='OOXML'
				)||(
					(
						returnNodes[1]?.[':@']?.type==='string'||
						!returnNodes[1]?.[':@']?.type
					)&&
					returnNodes[0]?.[':@']?.type==='OOXML'
				)
			)
		){
			errors+='\nIf there are 2 output tags, exactly 1 must have the type of string and 1 must have the type of OOXML';
		}
		if(returnNodes.length===1&&(returnNodes[0]?.[':@']?.type!=='string'||!returnNodes[0]?.[':@']?.type)&&returnNodes[0]?.[':@']?.type!=='OOXML'){
			errors+='\nThe output type must be either string or OOXML';
		}
		if(returnNodes.filter(outputNode=>!outputNode?.[':@']?.variable).length>0){
			errors+='\nNo variable specified in output tag';
		}
		if(errors)return{
			errors,
			warnings,
			outputReturns
		};
		outputReturns=returnNodes.map(outputNode=>({
			type:outputNode?.[':@']?.type==='OOXML'?'OOXML':'string',
			variable:outputNode[':@'].variable
		}));
		return{
			errors,
			warnings,
			outputReturns
		};
	}
};

export default LegaldacClauseXmlScript;