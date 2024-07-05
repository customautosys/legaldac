import type libarchive_js from 'libarchive.js';
import type {ArchiveReader} from 'libarchive.js/dist/build/compiled/archive-reader';
import LegaldacDocumentXmlScript from './LegaldacDocumentXmlScript';
import ArchiveFolderClauseRepository from './ArchiveFolderClauseRepository';
import Legaldac7Z from './Legaldac7Z';
import type ArchiveFolder from '../interfaces/ArchiveFolder';

export class LegaldacDocument7Z extends Legaldac7Z{
	protected ldxs:LegaldacDocumentXmlScript|null=null;

	async parseArchive(archive:ArchiveReader,archiveFiles:ArchiveFolder){
		let ldxsFilenames=Object.keys(archiveFiles).filter(filename=>filename.toLowerCase().endsWith('.ldxs')&&archiveFiles[filename] instanceof File);
		if(ldxsFilenames.length<1)throw new Error('No LDXS LEGAL-DAC Document XML Script found');
		if(ldxsFilenames.length>1)throw new Error('More than 1 LDXS LEGAL-DAC Document XML Script found when only 1 is allowed');
		let ldxs=new LegaldacDocumentXmlScript();
		let ldxsFile:File=archiveFiles[ldxsFilenames[0]] as File;
		await ldxs.parse(await ldxsFile.text(),new ArchiveFolderClauseRepository(archiveFiles));
		//parse successful as there was no error
		this.ldxs=ldxs;
	}
};

export default LegaldacDocument7Z;