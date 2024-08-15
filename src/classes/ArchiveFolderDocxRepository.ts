import type ArchiveFolder from '../interfaces/ArchiveFolder';
import type DocxRepository from '../interfaces/DocxRepository';

export class ArchiveFolderDocxRepository implements DocxRepository{
	constructor(protected archiveFiles:ArchiveFolder){}

	async getDocx(name:string){
		if(!name.toLowerCase().endsWith('.docx'))throw new Error('Filename does not end with .docx');
		if(!(this.archiveFiles[name] instanceof File))throw new Error('Invalid filename '+name);
		return this.archiveFiles[name].arrayBuffer();
	}
};

export default ArchiveFolderDocxRepository;