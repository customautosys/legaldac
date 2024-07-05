import type libarchive_js from 'libarchive.js';
import type {ArchiveReader} from 'libarchive.js/dist/build/compiled/archive-reader';
import LegaldacClauseXmlScript from './LegaldacClauseXmlScript';
import ArchiveFolderClauseRepository from './ArchiveFolderClauseRepository';
import Legaldac7Z from './Legaldac7Z';
import type ArchiveFolder from '../interfaces/ArchiveFolder';

export class LegaldacClause7Z extends Legaldac7Z{
	protected lcxs:LegaldacClauseXmlScript|null=null;

	async parseArchive(archive:ArchiveReader,archiveFiles:ArchiveFolder){
		let lcxsFilenames=Object.keys(archiveFiles).filter(filename=>filename.toLowerCase().endsWith('.lcxs')&&archiveFiles[filename] instanceof File);
		if(lcxsFilenames.length<1)throw new Error('No LCXS LEGAL-DAC Clause XML Script found');
		if(lcxsFilenames.length>1)throw new Error('More than 1 LCXS LEGAL-DAC Clause XML Script found when only 1 is allowed');
		let lcxs=new LegaldacClauseXmlScript();
		let lcxsFile:File=archiveFiles[lcxsFilenames[0]] as File;
		await lcxs.parse(await lcxsFile.text(),new ArchiveFolderClauseRepository(archiveFiles));
		//parse successful as there was no error
		this.lcxs=lcxs;
	}
};

export default LegaldacClause7Z;