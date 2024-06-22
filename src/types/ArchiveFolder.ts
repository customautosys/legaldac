export interface ArchiveFolder{
	[key:string]:ArchiveFolder|File;
};

export default ArchiveFolder;