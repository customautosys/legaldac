import type libarchive_js from 'libarchive.js';
import type {ArchiveReader} from 'libarchive.js/dist/build/compiled/archive-reader';
import LegaldacDocumentXmlScript from './LegaldacDocumentXmlScript';
import ArchiveFolderClauseRepository from './ArchiveFolderClauseRepository';
import type ArchiveFolder from '../interfaces/ArchiveFolder';

export class LegaldacDocument7Z{
	protected file:File|null=null;
	protected archive:ArchiveReader|null=null;
	protected archiveFiles:ArchiveFolder|null=null;
	protected ldxs:LegaldacDocumentXmlScript|null=null;

	async load(file:File){
		this.file=file;
		const libarchive:typeof libarchive_js=await import(typeof window==='undefined'?'libarchive.js/dist/libarchive-node.mjs':'libarchive.js');
		let archive=await libarchive.Archive.open(file);
		let archiveFiles:ArchiveFolder=await archive.extractFiles();
		let ldxsFilenames=Object.keys(archiveFiles).filter(filename=>filename.toLowerCase().endsWith('.ldxs')&&archiveFiles[filename] instanceof File);
		if(ldxsFilenames.length<1)throw new Error('No LDXS LEGAL-DAC Document XML Script found');
		if(ldxsFilenames.length>1)throw new Error('More than 1 LDXS LEGAL-DAC Document XML Script found when only 1 is allowed');
		let ldxs=new LegaldacDocumentXmlScript();
		let ldxsFile:File=archiveFiles[ldxsFilenames[0]] as File;
		await ldxs.parse(await ldxsFile.text(),new ArchiveFolderClauseRepository(archiveFiles));
		//parse successful as there was no error
		this.file=file;
		this.archive=archive;
		this.archiveFiles=archiveFiles;
		this.ldxs=ldxs;
	}
};

export default LegaldacDocument7Z;