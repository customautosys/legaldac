import {Archive} from 'libarchive.js';
import type {ArchiveReader} from 'libarchive.js/dist/build/compiled/archive-reader';
import type {CompressedFile} from 'libarchive.js/dist/build/compiled/compressed-file';
import LegaldacDocumentXmlScript from './LegaldacDocumentXmlScript';
import type ArchiveFolder from './ArchiveFolder';

export class LegaldacDocument7Z{
	protected file:File|null=null;
	protected archive:ArchiveReader|null=null;
	protected archiveFiles:ArchiveFolder|null=null;
	protected ldxs:LegaldacDocumentXmlScript|null=null;

	async load(file:File){
		this.file=file;
		let archive=await Archive.open(file);
		let archiveFiles:ArchiveFolder=await archive.getFilesObject();
		let ldxsFilenames=Object.keys(archiveFiles).filter(filename=>filename.toLowerCase().endsWith('.ldxs'));
		if(ldxsFilenames.length<1)throw new Error('No LDXS LEGAL-DAC Document XML Script found');
		if(ldxsFilenames.length>1)throw new Error('More than 1 LDXS LEGAL-DAC Document XML Script found when only 1 is allowed');
		let ldxs=new LegaldacDocumentXmlScript();
		let ldxsFile:File=(archiveFiles[ldxsFilenames[0]] as CompressedFile).extract();
		await ldxs.parse(ldxsFile,archiveFiles);
		//parse successful as there was no error
		this.file=file;
		this.archive=archive;
		this.archiveFiles=archiveFiles;
		this.ldxs=ldxs;
	}
};

export default LegaldacDocument7Z;