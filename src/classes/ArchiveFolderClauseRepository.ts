import semver from 'semver';
import type ArchiveFolder from '../interfaces/ArchiveFolder';
import type ClauseReference from '../interfaces/ClauseReference';
import type ClauseRepository from '../interfaces/ClauseRepository';
import type ClauseData from '../interfaces/ClauseData';

export class ArchiveFolderClauseRepository implements ClauseRepository{
	constructor(protected archiveFiles:ArchiveFolder){}

	getClauseIdentifier(clauseReference:ClauseReference){
		let errors='';
		if(typeof clauseReference.id!=='string')errors+='\nClause reference tag id must be a string';
		if(!semver.validRange(clauseReference.version))errors+='\nClause reference tag id '+String(clauseReference.id)+' does not have a version attribute in the format [^]<number>.<number>.<number> or other valid semver range format';
		if(errors)throw new Error('Errors:'+errors);
		let matchingFolders=Object.keys(this.archiveFiles).filter(filename=>filename.startsWith(clauseReference.id+'@')&&!(this.archiveFiles[filename] instanceof File));
		if(matchingFolders.length<=0)throw new Error('No clause folders matching id '+clauseReference.id);
		matchingFolders.sort((folder1,folder2)=>semver.compare(folder1.split('@')[1],folder2.split('@')[1]));
		let identifier='';
		for(let i=matchingFolders.length;--i>=0;){
			if(semver.satisfies(matchingFolders[i].split('@')[1],clauseReference.version)){
				identifier=matchingFolders[i];
			}
		}
		return identifier;
	}

	async getClauseData(clauseReference:ClauseReference){
		let errors='';
		let identifier=this.getClauseIdentifier(clauseReference);
		if(!identifier)throw new Error('No clause folders for '+clauseReference.id+' satisfying version '+clauseReference.version);
		let lcxsFilenames=Object.keys(this.archiveFiles[identifier]).filter(filename=>filename.toLowerCase().endsWith('.lcxs'));
		if(lcxsFilenames.length<1)throw new Error('No LCXS LEGAL-DAC Clause XML Script found');
		if(lcxsFilenames.length>1)throw new Error('More than 1 LCXS LEGAL-DAC Clause XML Script found when only 1 is allowed');
		let lcxs:File|null=null;
		if(!((this.archiveFiles[identifier] as ArchiveFolder)[lcxsFilenames[0]] instanceof File))errors+='\nInvalid file '+lcxsFilenames[0];
		else lcxs=(this.archiveFiles[identifier] as ArchiveFolder)[lcxsFilenames[0]] as File;
		let scriptFilenames=Object.keys(this.archiveFiles[identifier]).filter(filename=>filename.toLowerCase().endsWith('.ts')||filename.toLowerCase().endsWith('.js'));
		for(let i=scriptFilenames.length;--i>=0;){
			if(!((this.archiveFiles[identifier] as ArchiveFolder)[scriptFilenames[i]] instanceof File)){
				errors+='\nInvalid file '+scriptFilenames[i];
				scriptFilenames.splice(i,1);
			}
		}
		let results=await Promise.allSettled([...(lcxs?[lcxs.text()]:[]),...scriptFilenames.map(scriptFilename=>(this.archiveFiles[scriptFilename] as File).text())]);
		results.filter(result=>result.status==='rejected').forEach(rejected=>errors+='\n'+(rejected as PromiseRejectedResult).status);
		if(errors)throw new Error('Errors:'+errors);
		return <ClauseData>{
			identifier,
			xml:(results[0] as PromiseFulfilledResult<string>).value,
			scripts:Object.fromEntries(results.slice(1).map((result,index)=>[scriptFilenames[index],(result as PromiseFulfilledResult<string>).value]))
		};
	}
};

export default ArchiveFolderClauseRepository;