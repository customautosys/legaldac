import docxtemplater from 'docxtemplater';
import LegaldacXmlScript from './LegaldacXmlScript';
import type ClauseRepository from '../interfaces/ClauseRepository';
import type InputParameter from '../interfaces/InputParameter';
import type PreserveOrderXmlNode from '../interfaces/PreserveOrderXmlNode';
import type DocumentOutputReturn from '../interfaces/DocumentOutputReturn';
import type DocumentParseOutputReturn from '../interfaces/DocumentParseOutputReturn';
import type OutputDocumentTag from '../interfaces/OutputDocumentTag';
import type Statement from '../interfaces/Statement';
import type DocumentGenerationSection from '../interfaces/DocumentGenerationSection';
import type PromptParams from '../interfaces/PromptParams';
import type PromptReturn from '../interfaces/PromptReturn';
import type ExecutionInputParams from '../interfaces/ExecutionInputParams';
import type DocxRepository from '../interfaces/DocxRepository';
import PizZip from 'pizzip';

export class LegaldacDocumentXmlScript extends LegaldacXmlScript{
	protected generationSections:DocumentGenerationSection[]=[];

	async parse(xml:string,clauseRepository:ClauseRepository){
		return super.parse(xml,clauseRepository,'document');
	}

	protected async parseOutput(generationNodes:PreserveOrderXmlNode[],parsedXml:PreserveOrderXmlNode[],inputParameters:InputParameter[],clauseRepository:ClauseRepository){
		let errors='';
		let warnings='';
		let outputReturns:DocumentOutputReturn[]=[];
		let outputNodes=generationNodes[0].generation.filter(node=>node['output']);
		if(outputNodes.length<1)errors+='\nNo output tag found';
		if(errors)return{
			errors,
			warnings,
			outputReturns
		};
		if(outputNodes.length>1)warnings+='\nMore than 1 output tag found when only 1 is allowed, only parsing 1st output tag';
		let returnAllInputs=outputNodes[0]?.[':@']?.returnAllInputs==='false'?false:true;
		let returnAllVariables=outputNodes[0]?.[':@']?.returnAllVariables==='false'?false:true;
		let documentNodes=outputNodes[0].output.filter(node=>node['document']);
		if(documentNodes.length<1)errors+='\nNo document tag found';
		if(documentNodes.length>1)warnings+='\nMore than 1 document tag found when only 1 is allowed, only parsing 1st document tag';
		if(errors)return{
			errors,
			warnings,
			outputReturns,
			returnAllInputs,
			returnAllVariables
		};
		if(
			(
				!documentNodes[0]?.[':@']?.constant&&
				documentNodes[0]?.[':@']?.variable
			)||(
				String(documentNodes[0]?.[':@']?.constant).toLowerCase().endsWith('.docx')&&
				!documentNodes[0]?.[':@']?.variable
			)
		){
			errors+='\nDocument tag must either have a constant attribute which ends in .docx, or a variable attribute';
		}
		if(errors)return{
			errors,
			warnings,
			outputReturns,
			returnAllInputs,
			returnAllVariables
		};
		let outputDocumentTag:OutputDocumentTag={
			type:documentNodes[0]?.[':@']?.variable?'variable':'constant',
			value:documentNodes[0]?.[':@']?.variable?documentNodes[0][':@'].variable:documentNodes[0]?.[':@']?.constant
		};
		let returnNodes=outputNodes[0].output.filter(node=>node['return']);
		if(!returnAllInputs&&!returnAllVariables&&returnNodes.length<1)warnings+='\nNo return tags found and neither returning all inputs nor returning all variables, nothing will be replaced';
		if(returnNodes.filter(returnNode=>returnNode?.[':@']?.type&&returnNode?.[':@']?.type!=='string'&&returnNodes[0]?.[':@']?.type!=='OOXML')){
			errors+='\nThe return type must be either string or OOXML';
		}
		if(returnNodes.filter(returnNode=>!returnNode?.[':@']?.variable).length>0){
			errors+='\nNo variable specified in return tag';
		}
		if(errors)return{
			errors,
			warnings,
			outputReturns,
			outputDocumentTag,
			returnAllInputs,
			returnAllVariables
		};
		outputReturns=returnNodes.map(returnNode=>({
			type:returnNode?.[':@']?.type==='OOXML'?'OOXML':'string',
			variable:returnNode[':@'].variable,
			...(returnNode?.[':@']?.replace?{replace:returnNode?.[':@']?.replace}:{})
		}));
		return{
			errors,
			warnings,
			outputReturns,
			outputDocumentTag,
			returnAllInputs,
			returnAllVariables
		};
	}

	protected createGenerationSection(locale:string,inputParameters:InputParameter[],statements: Statement[],parseOutputReturn:DocumentParseOutputReturn):DocumentGenerationSection{
		return <DocumentGenerationSection>{
			locale,
			inputParameters,
			statements,
			outputReturns:parseOutputReturn.outputReturns,
			outputDocumentTag:parseOutputReturn.outputDocumentTag,
			returnAllInputs:parseOutputReturn.returnAllInputs,
			returnAllVariables:parseOutputReturn.returnAllVariables
		};
	}

	async execute(docxRepository:DocxRepository,executionInputParams:ExecutionInputParams,prompt:(promptParams:PromptParams)=>Promise<PromptReturn>|PromptReturn,locale?:string):Promise<Blob>{
		let generationSection:DocumentGenerationSection;
		if(locale){
			let section=this.generationSections.find(generationSection=>generationSection.locale===locale);
			if(section){
				generationSection=section;
			}else{
				throw new Error('No generation section found with locale '+locale);
			}
		}else{
			if(this.defaultLocale){
				let section=this.generationSections.find(generationSection=>generationSection.locale===this.defaultLocale);
				if(section){
					generationSection=section;
				}else{
					throw new Error('No generation section found with locale '+this.defaultLocale);
				}
			}else{
				generationSection=this.generationSections[0];
			}
		}
		//dummy, just take all the inputs and map it to the output for now
		let docxPizzip=new PizZip(await docxRepository.getDocx(generationSection.outputDocumentTag.value));
		let templater=new docxtemplater(docxPizzip,{
			paragraphLoop:true,
			linebreaks:true
		});
		await templater.renderAsync(executionInputParams);
		return templater.getZip().generate({
			type:'blob',
			mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			compression:'DEFLATE'
		});
	}
};

export default LegaldacDocumentXmlScript;