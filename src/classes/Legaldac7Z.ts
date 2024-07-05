import type libarchive_js from 'libarchive.js';
import type {ArchiveReader} from 'libarchive.js/dist/build/compiled/archive-reader';
import type ArchiveFolder from '../interfaces/ArchiveFolder';

export abstract class Legaldac7Z{
	protected static libarchive:typeof libarchive_js|null;

	protected file:File|null=null;
	protected archive:ArchiveReader|null=null;
	protected archiveFiles:ArchiveFolder|null=null;

	async load(file:File){
		if(!Legaldac7Z.libarchive)Legaldac7Z.libarchive=await import(typeof window==='undefined'?'libarchive.js/dist/libarchive-node.mjs':'libarchive.js');
		if(!Legaldac7Z.libarchive)throw new Error('Error initialising libarchive.js');
		let archive=await Legaldac7Z.libarchive.Archive.open(file);
		let archiveFiles:ArchiveFolder=await archive.extractFiles();
		await this.parseArchive(archive,archiveFiles);
		//parse successful as there was no error
		this.file=file;
		this.archive=archive;
		this.archiveFiles=archiveFiles;
	}

	abstract parseArchive(archive:ArchiveReader,archiveFiles:ArchiveFolder):Promise<void>|void;
};

export default Legaldac7Z;