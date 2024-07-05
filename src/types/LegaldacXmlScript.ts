import{
	X2jOptions,
	XMLParser
}from 'fast-xml-parser';
import semver from 'semver';
import package_json from '../../package.json';
import type PreserveOrderXmlNode from './PreserveOrderXmlNode';
import type ClauseReference from './ClauseReference';
import type InputParameter from './InputParameter';
import type ClauseRepository from './ClauseRepository';
import type ClauseData from './ClauseData';
import type OutputReturn from './OutputReturn';
import type ParseOutputReturn from './ParseOutputReturn';

export abstract class LegaldacXmlScript{
	protected static readonly XML_PARSER_OPTIONS:X2jOptions={
		alwaysCreateTextNode:true,
		preserveOrder:true,
		ignoreAttributes:false,
		allowBooleanAttributes:true,
		processEntities:true,
    	htmlEntities:true
	};
	protected static readonly xmlParser=new XMLParser(LegaldacXmlScript.XML_PARSER_OPTIONS);

	protected parsedXml:PreserveOrderXmlNode[]=[];
	protected version='';
	protected clauseReferences:ClauseReference[]=[];
	protected clauseDatas:ClauseData[]=[];
	protected inputParameters:InputParameter[]=[];
	protected outputReturns:OutputReturn[]=[];

	async parse(xml:string,clauseRepository:ClauseRepository,rootNodeName:string){
		let errors='';
		let warnings='';
		let parsedXml:PreserveOrderXmlNode[]=LegaldacXmlScript.xmlParser.parse(xml);
		let rootNodes=parsedXml.filter(node=>node[rootNodeName]);
		if(rootNodes.length<1)throw new Error('No root '+rootNodeName+' tag');
		if(rootNodes.length>1)warnings+='\nMore than 1 root '+rootNodeName+' tag found when only 1 is allowed, only parsing 1st '+rootNodeName+' tag';
		let version=String(rootNodes[0][':@']?.version);
		if(!semver.valid(version))warnings+='\nAll root '+rootNodeName+' tags must have a version attribute in the format <number>.<number>.<number>';
		let legaldacversion=String(rootNodes[0][':@']?.legaldacversion);
		if(!semver.valid(legaldacversion))warnings+='\nAll root '+rootNodeName+' tags must have a legaldacversion attribute in the format <number>.<number>.<number>';
		if(semver.gt(legaldacversion,package_json.version))warnings+='\nlegaldacversion is newer than this version of LEGAL-DAC';
		let rootNode=rootNodes[0].document;
		let clausesNodes=rootNode.filter(node=>node['clauses']);
		if(clausesNodes.length>1)warnings+='More than 1 clauses tag found under root '+rootNodeName+' tag when at most 1 is allowed, only parsing 1st clauses tag';
		let clauseReferences:ClauseReference[]=[];
		let clauseDatas:{[key:string]:ClauseData}={};
		if(clausesNodes.length>=1){
			let clauseReferenceNodes=clausesNodes[0].clauses.filter(node=>node['clause']);
			let results=await Promise.allSettled(clauseReferenceNodes.map(async clauseReferenceNode=>{
				let clauseReference:ClauseReference={
					id:clauseReferenceNode[':@']?.id,
					version:String(clauseReferenceNode[':@']?.version)
				};
				let clauseData=await clauseRepository.getClauseData(clauseReference);
				return {clauseData,clauseReference};
			}));
			results.forEach(result=>{
				if(result.status==='fulfilled'){
					clauseDatas[result.value.clauseData.identifier]=result.value.clauseData;
					clauseReferences.push(result.value.clauseReference);
					return;
				}
				errors+='\n'+result.reason;
			});
		}
		let inputParameters:InputParameter[]=[];
		let outputReturns:OutputReturn[]=[];
		let generationNodes=rootNode.filter(node=>node['generation']);
		if(generationNodes.length<1)errors+='\nNo generation tag found';
		if(generationNodes.length>1)warnings+='\nMore than 1 generation tag found when only 1 is allowed, only parsing 1st generation tag';
		if(generationNodes.length>=1){
			//input section
			let inputNodes=generationNodes[0].generation.filter(node=>node['input']);
			if(inputNodes.length>1)warnings+='\nMore than 1 input tag found when at most 1 is allowed, only parsing 1st input tag';
			if(inputNodes.length>=1){
				let parameterNodes=inputNodes[0].input.filter(node=>node['parameter']);
				if(parameterNodes.length>=1){
					for(let i=0;i<parameterNodes.length;++i){
						let name=parameterNodes[i][':@'].name;
						if(typeof name!=='string'||!name){
							errors+='\nInvalid name of input parameter';
							continue;
						}
						if(inputParameters.findIndex(inputParameter=>inputParameter.name===name)>=0){
							warnings+='\nDuplicate input parameter '+name+', ignoring duplicates after 1st parameter tag';
							continue;
						}
						let type:'string'|'number'|'boolean'='string';
						if(parameterNodes[i][':@'].type==='number'||parameterNodes[i][':@'].type==='boolean'){
							parameterNodes[i][':@'].type='string';
						}else if(parameterNodes[i][':@'].type!=='string'){
							warnings='\nInvalid type of input parameter '+name+', defaulting to string';
						}
						let prompt=parameterNodes[i].parameter.filter(text=>text['#text']).map(text=>text['#text']).join(' ');
						if(typeof prompt!=='string'||!prompt){
							warnings+='Invalid prompt of input parameter '+name+', setting prompt to name';
							prompt=name;
						}
						inputParameters.push({
							name,
							type,
							prompt
						});
					}
				}
			}

			//output section
			let parseOutputReturns=await this.parseOutputs(generationNodes,parsedXml,inputParameters,clauseRepository);
			outputReturns=parseOutputReturns.outputReturns;
			errors+=String(parseOutputReturns.errors);
			warnings+=String(parseOutputReturns.warnings);
		}
		if(errors)throw new Error('Errors:'+errors+'\n\nWarnings:'+warnings);
		this.parsedXml=parsedXml;
		this.version=version;
		this.clauseReferences=clauseReferences;
		this.inputParameters=inputParameters;
		this.outputReturns=outputReturns;
		if(warnings)return 'Warnings:'+warnings;
	}

	abstract parseOutputs(generationNodes:PreserveOrderXmlNode[],parsedXml:PreserveOrderXmlNode[],inputParameters:InputParameter[],clauseRepository:ClauseRepository):Promise<ParseOutputReturn>|ParseOutputReturn;
};

export default LegaldacXmlScript;