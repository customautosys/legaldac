import type {CompressedFile} from 'libarchive.js/dist/build/compiled/compressed-file';

export interface ArchiveFolder{
	[key:string]:ArchiveFolder|CompressedFile
};

export default ArchiveFolder;